import { IScene } from '../scenes/IScene';
import { IController } from './IController';
import { SelectController } from './SelectControllers';

export class BarController implements IController {
  public static readonly KEY: Symbol = Symbol();

  public preload(scene: IScene): void {
    scene.load.image('bar', 'assets/bar.png');
    scene.load.image('bar.top', 'assets/bar.top.png');
    scene.load.image('door', 'assets/door.png');
  }

  public create(scene: IScene): void {
    const x = scene.settings.middle;
    const y = scene.settings.floor;
    const spriteBar = scene.add.sprite(x, y, 'bar');
    spriteBar
      .setY(spriteBar.y - 10)
      .setScale(0.8)
      .setDepth(1);
    scene.settings.positionBag.set('bar', spriteBar);

    const spriteBarTop = scene.add.sprite(x, y - 80, 'bar.top');
    spriteBarTop.setScale(0.8);

    const spriteDoor = scene.add.image(100, y - 25, 'door');
    scene.settings.positionBag.set('door', spriteDoor);

    const selectController: SelectController = scene.getController(
      SelectController.KEY
    );
    selectController.addSelect(scene, spriteDoor);
    selectController.addSelect(scene, spriteBar);
  }

  public update(scene: IScene, delta: number): void {}
}
