import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IIngredientGameObject } from '../../entities/game/IIngredientGameObject';
import { IScene } from '../../entities/game/IScene';
import { IngredientType } from '../../entities/static/Ingredient';
import { BottleBuilder } from './BottleBuilder';
import { FruitBuilder } from './FruitBuilder';

export class IngredientBuilder {
  private readonly _scene: IScene;
  private readonly _liquidEmitter: IEmitter;
  private readonly _fruitEmitter: IEmitter;

  public constructor(
    scene: IScene,
    liquidEmitter: IEmitter,
    fruitEmitter: IEmitter
  ) {
    this._scene = scene;
    this._liquidEmitter = liquidEmitter;
    this._fruitEmitter = fruitEmitter;
  }

  public build(ingredient: IngredientExtended): IIngredientGameObject {
    switch (ingredient.provided.base.type) {
      case IngredientType.Bottle:
        return new BottleBuilder(this._scene, this._liquidEmitter).build(
          ingredient
        );
      case IngredientType.Fruit:
        return new FruitBuilder(this._scene, this._fruitEmitter).build(
          ingredient
        );
    }
  }
}
