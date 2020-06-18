import { $S } from '../Settings';
import { IController } from './IController';

export class BarController implements IController {
  public preload(scene: Phaser.Scene): void {
    scene.load.image('bar', 'assets/bar.png');
    scene.load.image('bar.top', 'assets/bar.top.png');
    scene.load.image('door', 'assets/door.png');
  }

  public create(scene: Phaser.Scene): void {
    scene.input.setDefaultCursor('url(assets/cursor.basic.png), pointer');

    const x = $S.middle(scene);
    const y = $S.floor(scene);
    const spriteBar = scene.add.sprite(x, y, 'bar');
    spriteBar
      .setY(spriteBar.y - 10)
      .setScale(0.8)
      .setDepth(1);
    $S.positionBag.set('bar', { x: spriteBar.x, y: spriteBar.y });

    const spriteBarTop = scene.add.sprite(x, y - 80, 'bar.top');
    spriteBarTop.setScale(0.8);

    const spriteDoor = scene.add.image(100, y - 25, 'door');
  }

  public update(delta: number): void {}
}
