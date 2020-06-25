import {
  Ingredient,
  IngredientKey,
  Ingredients
} from '../../entities/Ingredient';
import { IScene } from '../scenes/IScene';
import { Point } from '../sprites/Point';
import { SpriteKey } from '../sprites/SpriteKey';

export class Bottle {
  private readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _ingredient: Ingredient;
  private readonly _initialPosition: Point;

  private _dayStock: number;
  private _currentStock: number;

  constructor(
    sprite: Phaser.GameObjects.Sprite,
    ingredient: Ingredient,
    stock: number
  ) {
    this._sprite = sprite;
    this._ingredient = ingredient;
    this._initialPosition = { x: sprite.x, y: sprite.y };

    this._dayStock = stock;
    this._currentStock = stock;
  }

  public turnOn(glass: Point): void {
    this._sprite.setRotation(80);
    this._sprite.setPosition(glass.x, glass.y);

    if (this._currentStock > 0) {
      // play particule system
    }
  }

  public turnOff(): void {
    this._sprite.setRotation(0);
    this._sprite.setPosition(this._initialPosition.x, this._initialPosition.y);

    // stop particule system
  }

  public static buildRum(scene: IScene): Bottle {
    const position = scene.settings.bottlePosition;
    const sprite = scene.add.sprite(
      position.x,
      position.y,
      SpriteKey.RumBottle
    );

    const ingredient = Ingredients.get(IngredientKey.Rum);
    const stock = scene.inventory.getGlobalIngredientStock(IngredientKey.Rum);
    if (ingredient === undefined) {
      throw new Error('Ingredient is not defiend globally');
    }

    const bottle = new Bottle(sprite, ingredient, stock);
    const glass = scene.settings.glassPosition;

    sprite.setInteractive();
    sprite.on('pointerdown', () => {
      bottle.turnOn(glass);
    });
    sprite.on('pointerup', () => {
      bottle.turnOff();
    });

    return bottle;
  }
}
