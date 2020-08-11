import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';
import { GlassKey } from '../../entities/static/Glass';
import { GlassBuilder } from '../builders/GlassBuilder';
import { Glass } from '../cocktails/Glass';
import { SelectController } from './SelectController';
import { BarControllerHelper } from './helpers/BarControllerHelper';

export class BarController implements IController {
  public static readonly KEY = Symbol();

  private _glass?: Glass;
  private _block?: Phaser.GameObjects.GameObject;
  private _open: boolean = true;

  /** Interface **/
  public preload(scene: IScene): void {
    BarControllerHelper.preload(scene);
  }

  public create(scene: IScene): void {
    const { spriteDoor, spriteBar, block } = BarControllerHelper.create(scene);
    this._block = block;

    spriteDoor.on('pointerdown', () => {
      this._open = !this._open;
      if (this._open) {
        spriteDoor.setFrame('open.png');
      } else {
        spriteDoor.setFrame('close.png');
      }
    });

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, spriteDoor);
    selectCtr.addSelect(scene, spriteBar);
  }

  public update(scene: IScene, delta: number): void {}

  public rescale(): void {}

  /** Custom **/
  public get open(): boolean {
    return this._open;
  }

  public get glass(): Glass | undefined {
    return this._glass;
  }

  public createGlass(scene: IScene, key: GlassKey): void {
    this._glass = new GlassBuilder(scene).setGlassKey(key).build();
    if (this._block !== undefined) {
      this._glass.addCollider(scene, this._block, false);
    }
  }

  public destroyGlass() {
    this._glass?.destroy();
    this._glass = undefined;
  }
}
