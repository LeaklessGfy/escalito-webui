import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';
import { GlassKey } from '../../entities/static/Glass';
import { GlassBuilder } from '../builders/GlassBuilder';
import { Glass } from '../cocktails/Glass';
import { SpriteKey } from '../sprites/SpriteKey';
import { SelectController } from './SelectController';

export class BarController implements IController {
  public static readonly KEY = Symbol();

  private _door?: Phaser.GameObjects.Image;
  private _glass?: Glass;

  public open: boolean = true;

  /** Interface **/
  public preload(scene: IScene): void {
    scene.load.image(SpriteKey.Bar, 'assets/bar.png');
    scene.load.image(SpriteKey.BarTop, 'assets/bar.top.png');
    scene.load.image(SpriteKey.DefaultGlass, 'assets/glass.default.png');
    scene.load.image(
      SpriteKey.DefaultGlassMask,
      'assets/glass.default.mask.png'
    );
    scene.load.image(SpriteKey.Square, 'assets/square.png');
    scene.load.multiatlas(SpriteKey.Door, 'assets/door.atlas.json', 'assets');
  }

  public create(scene: IScene): void {
    const { x, y } = scene.settings.barPosition;
    const xDoor = scene.settings.spawnPosition.x;

    const spriteBar = scene.add.sprite(x, y, SpriteKey.Bar);
    spriteBar
      .setY(y - 10)
      .setScale(0.8)
      .setDepth(1)
      .setName('Bar');

    const spriteBarTop = scene.add.sprite(x, y, SpriteKey.BarTop);
    spriteBarTop.setY(y - 80).setScale(0.8);

    this._door = scene.add.image(xDoor, y, SpriteKey.Door, 'open.png');
    this._door
      .setY(y + 10 - this._door.frame.height / 2)
      .setInteractive()
      .on('pointerdown', () => {
        this.open = !this.open;
      })
      .setName('Door');

    scene.add.rectangle(
      scene.settings.middleWidth,
      scene.settings.middleHeight,
      scene.settings.width,
      5,
      0xffffff,
      1
    );

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, this._door);
    selectCtr.addSelect(scene, spriteBar);
  }

  public update(scene: IScene, delta: number): void {
    if (this._door === undefined) {
      return;
    }

    if (this.open && this._door.frame.name !== 'open.png') {
      this._door.setFrame('open.png');
    } else if (!this.open && this._door.frame.name !== 'close.png') {
      this._door.setFrame('close.png');
    }
  }

  /** Custom **/
  public get glass(): Glass | undefined {
    return this._glass;
  }

  public createGlass(scene: IScene, key: GlassKey): void {
    this._glass = new GlassBuilder(scene).setGlassKey(key).build();
  }

  public destroyGlass() {
    this._glass?.destroy();
    this._glass = undefined;
  }
}
