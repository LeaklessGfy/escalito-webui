import { IScene } from '../scenes/IScene';
import { IController } from './IController';

export class SelectController implements IController {
  public static readonly KEY = Symbol();
  private readonly _selectors: Phaser.GameObjects.GameObject[] = [];

  public get key(): Symbol {
    return SelectController.KEY;
  }

  public preload(scene: IScene): void {}

  public create(scene: IScene): void {
    scene.input.setDefaultCursor('url(assets/cursor.basic.png), pointer');
  }

  public update(scene: IScene, delta: number): void {}

  public addSelect(scene: IScene, sprite: Phaser.GameObjects.GameObject) {
    this._selectors.push(sprite);

    sprite.setInteractive();
    sprite.on('pointerover', () => {
      scene.input.setDefaultCursor('url(assets/cursor.hover.png), pointer');
    });
    sprite.on('pointerout', () => {
      scene.input.setDefaultCursor('url(assets/cursor.basic.png), pointer');
    });
  }
}
