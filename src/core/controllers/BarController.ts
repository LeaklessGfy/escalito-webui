import { $S } from '../Settings';
import { IController } from './IController';

export class BarController implements IController {
  public preload(scene: Phaser.Scene): void {
    scene.load.image('bar', 'assets/bar.png');
  }

  public create(scene: Phaser.Scene): void {
    const x = $S.middle(scene);
    const y = $S.floor(scene);
    const sprite = scene.add.sprite(x, y, 'bar');
    sprite
      .setY(sprite.y - 10)
      .setScale(0.8)
      .setDepth(1);

    $S.positionBag.set('bar', { x: sprite.x, y: sprite.y });
  }

  public update(delta: number): void {}
}
