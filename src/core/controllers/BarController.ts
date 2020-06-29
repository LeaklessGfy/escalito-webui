import { Bottle } from '../cocktails/Bottle';
import { Glass } from '../cocktails/Glass';
import { IScene } from '../scenes/IScene';
import { PositionKey } from '../sprites/PositionKey';
import { SpriteKey } from '../sprites/SpriteKey';
import { IController } from './IController';
import { SelectController } from './SelectControllers';

export class BarController implements IController {
  public static readonly KEY: Symbol = Symbol();

  public preload(scene: IScene): void {
    scene.load.image(SpriteKey.Bar, 'assets/bar.png');
    scene.load.image(SpriteKey.BarTop, 'assets/bar.top.png');
    scene.load.image(SpriteKey.Door, 'assets/door.png');
    scene.load.image(SpriteKey.RumBottle, 'assets/bottle.rum.png');
    scene.load.image(SpriteKey.DefaultGlass, 'assets/glass.default.png');
  }

  public create(scene: IScene): void {
    const x = scene.settings.middleWidth;
    const y = scene.settings.floor;
    const spriteBar = scene.add.sprite(x, y, SpriteKey.Bar);
    spriteBar
      .setY(spriteBar.y - 10)
      .setScale(0.8)
      .setDepth(1);
    scene.settings.addPosition(PositionKey.Bar, spriteBar);

    const spriteBarTop = scene.add.sprite(x, y - 80, SpriteKey.BarTop);
    spriteBarTop.setScale(0.8);

    const spriteDoor = scene.add.image(100, y - 25, SpriteKey.Door);
    scene.settings.addPosition(PositionKey.Door, spriteDoor);

    Bottle.buildRum(scene);
    Glass.buildDefault(scene);

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, spriteDoor);
    selectCtr.addSelect(scene, spriteBar);
  }

  public update(scene: IScene, delta: number): void {}
}
