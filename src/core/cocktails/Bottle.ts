import { Ingredient, IngredientKey } from '../../entities/static/Ingredient';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { Point } from '../sprites/Point';
import { SpriteKey } from '../sprites/SpriteKey';

export class Bottle {
  private readonly _ingredient: Ingredient;
  private readonly _sprite: Phaser.Physics.Matter.Sprite;
  private readonly _body: Phaser.Physics.Arcade.Body;
  private readonly _initialPosition: Point;

  private _fullStock: number;
  private _currentStock: number;

  constructor(
    ingredient: Ingredient,
    sprite: Phaser.Physics.Matter.Sprite,
    stock: number
  ) {
    this._ingredient = ingredient;
    this._sprite = sprite;
    this._body = sprite.body as Phaser.Physics.Arcade.Body;
    this._initialPosition = { x: sprite.x, y: sprite.y };

    this._fullStock = stock;
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

  public charge() {
    this._currentStock = this._fullStock;
  }

  public static buildRum(scene: IScene): Bottle {
    const { x, y } = scene.settings.bottlePosition;
    const sprite = scene.matter.add.sprite(x, y, SpriteKey.RumBottle);
    sprite.setIgnoreGravity(true);

    const ingredient = scene.store.ingredients.get(IngredientKey.Rum);
    const stock = scene.inventory.getGlobalIngredientStock(IngredientKey.Rum);

    if (ingredient === undefined) {
      throw new Error('Ingredient is not defiend globally');
    }

    const bottle = new Bottle(ingredient, sprite, stock);
    const glass = scene.settings.glassPosition;

    sprite.setInteractive();
    sprite.on('pointerdown', () => {
      bottle.turnOn(glass);
    });
    sprite.on('pointerup', () => {
      bottle.turnOff();
    });

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, sprite);

    return bottle;
  }
}
