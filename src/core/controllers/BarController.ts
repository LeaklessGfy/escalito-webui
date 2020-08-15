import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';
import { GlassKey } from '../../entities/static/Glass';
import { GlassBuilder } from '../builders/GlassBuilder';
import { Glass } from '../cocktails/Glass';
import { AudioController } from './AudioController';
import { SelectController } from './SelectController';
import { BarControllerHelper } from './helpers/BarControllerHelper';

export class BarController implements IController {
  public static readonly KEY = Symbol();

  private _audioCtr!: AudioController;
  private _block!: Phaser.GameObjects.GameObject;
  private _spriteDoor!: Phaser.GameObjects.Image;
  private _glass?: Glass;
  private _open: boolean = true;

  /** Interface **/
  public preload(scene: IScene): void {
    this._audioCtr = scene.getController<AudioController>(AudioController.KEY);
    BarControllerHelper.preload(scene);
  }

  public create(scene: IScene): void {
    const {
      spriteBar,
      spriteDoor,
      spriteJukebox,
      block
    } = BarControllerHelper.create(scene);
    this._block = block;
    this._spriteDoor = spriteDoor;

    spriteDoor.on('pointerdown', () => {
      this.open = !this.open;
    });

    spriteJukebox.on('pointerdown', () => {
      this._audioCtr.playRandomBackground();
    });

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, spriteBar);
    selectCtr.addSelect(scene, spriteDoor);
    selectCtr.addSelect(scene, spriteJukebox);
  }

  public update(scene: IScene, delta: number): void {
    this._glass?.update();
  }

  public rescale(): void {}

  /** Custom **/
  public get open(): boolean {
    return this._open;
  }

  public get glass(): Glass | undefined {
    return this._glass;
  }

  public set open(open: boolean) {
    this._open = open;
    if (this._open) {
      this._spriteDoor.setFrame('open.png');
    } else {
      this._spriteDoor.setFrame('close.png');
    }
  }

  public createGlass(scene: IScene, key: GlassKey): void {
    this._glass = new GlassBuilder(scene).setGlassKey(key).build();
    this._glass.addCollider(scene, this._block, false);
  }

  public destroyGlass() {
    this._glass?.destroy();
    this._glass = undefined;
  }
}
