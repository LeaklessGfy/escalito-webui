import { IngredientKey } from '../../entities/static/Ingredient';
import { IScene } from '../scenes/IScene';
import { SpriteKey } from '../sprites/SpriteKey';

export class Glass {
  private readonly _sprite: Phaser.Physics.Matter.Sprite;
  private readonly _recipe: Map<IngredientKey, number>;

  constructor(sprite: Phaser.Physics.Matter.Sprite) {
    this._sprite = sprite;
    this._recipe = new Map();
  }

  public static buildDefault(scene: IScene): Glass {
    const { x, y } = scene.settings.glassPosition;
    const sprite = scene.matter.add.sprite(x, y, SpriteKey.DefaultGlass);
    sprite.setIgnoreGravity(true);
    sprite.setInteractive();
    scene.input.setDraggable(sprite);
    sprite.on('drag', (p: any, x: number, y: number) => {
      sprite.x = x;
      sprite.y = y;
    });

    return new Glass(sprite);
  }
}
