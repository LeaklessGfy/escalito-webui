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
    scene.load.image(SpriteKey.Wall, 'assets/wall.green.png');
    scene.load.image(SpriteKey.Wood, 'assets/wood.png');
  }

  public create(scene: IScene): void {
    const dim = scene.settings.dimension;
    const mid = scene.settings.middleDimension;
    const spawn = scene.settings.spawn;
    const floorHeight = scene.settings.floorHeight;

    const spriteWall = scene.add.tileSprite(
      0,
      mid.y,
      1950,
      300,
      SpriteKey.Wall
    );
    spriteWall.setY(mid.y + spriteWall.displayHeight / 2);

    const spriteWood = scene.add.tileSprite(0, dim.y, 1950, 48, SpriteKey.Wood);
    spriteWood.setY(dim.y - spriteWood.displayHeight / 2 - floorHeight);

    const spriteBar = scene.add.sprite(mid.x, dim.y, SpriteKey.Bar);
    spriteBar
      .setScale(0.8)
      .setY(dim.y - spriteBar.displayHeight / 2 - floorHeight)
      .setDepth(1)
      .setName('Bar');

    const spriteBarTop = scene.add.sprite(mid.x, dim.y, SpriteKey.BarTop);
    spriteBarTop
      .setScale(0.8)
      .setY(spriteBar.y - spriteBar.displayHeight * 1.7);

    this._door = scene.add.image(spawn.x, spawn.y, SpriteKey.Door, 'open.png');
    this._door
      .setY(spawn.y - this._door.frame.height / 2)
      .setInteractive()
      .on('pointerdown', () => {
        this.open = !this.open;
      })
      .setName('Door');

    scene.add.rectangle(mid.x, mid.y, dim.x, 5, 0xffffff, 1);
    scene.add.rectangle(
      mid.x,
      dim.y - floorHeight / 2,
      dim.x,
      floorHeight,
      0x000000,
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
