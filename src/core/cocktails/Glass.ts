import { Ingredient, IngredientKey } from '../../entities/static/Ingredient';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { SpriteKey } from '../sprites/SpriteKey';

export class Glass {
  private readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _recipe: Map<IngredientKey, number>;

  constructor(sprite: Phaser.GameObjects.Sprite) {
    this._sprite = sprite;
    this._recipe = new Map();
  }

  public get body(): Phaser.Physics.Arcade.Body {
    return this._sprite.body as Phaser.Physics.Arcade.Body;
  }

  public addIngredient(ingredient: Ingredient) {
    const base = this._recipe.get(ingredient.key) ?? 0;
    this._recipe.set(ingredient.key, base + ingredient.amount);
  }

  public static buildDefault(scene: IScene): Glass {
    const { x, y } = scene.settings.glassPosition;
    const sprite = scene.physics.add.sprite(x, y, SpriteKey.DefaultGlass);
    sprite
      .setScale(0.5)
      .setY(y - sprite.displayHeight / 2)
      .setInteractive()
      .setName('Glass')
      .setGravity(-1);
    (sprite.body as Phaser.Physics.Arcade.Body).allowGravity = false;

    scene.input.setDraggable(sprite);
    sprite.on('drag', (p: any, x: number, y: number) => {
      sprite.x = x;
      sprite.y = y;
    });

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, sprite);

    return new Glass(sprite);
  }
}
