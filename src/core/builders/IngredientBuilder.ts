import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IIngredientGameObject } from '../../entities/game/IIngredientGameObject';
import { IScene } from '../../entities/game/IScene';
import { IngredientType } from '../../entities/static/Ingredient';
import { BottleBuilder } from './BottleBuilder';
import { FruitBuilder } from './FruitBuilder';

export class IngredientBuilder {
  private readonly _bottleBuilder: BottleBuilder;
  private readonly _fruitBuilder: FruitBuilder;

  public constructor(
    scene: IScene,
    liquidEmitter: IEmitter,
    fruitEmitter: IEmitter
  ) {
    this._bottleBuilder = new BottleBuilder(scene, liquidEmitter);
    this._fruitBuilder = new FruitBuilder(scene, fruitEmitter);
  }

  public build(
    ingredient: IngredientExtended,
    nb: number
  ): IIngredientGameObject {
    switch (ingredient.provided.base.type) {
      case IngredientType.Bottle:
        return this._bottleBuilder.build(ingredient, nb);
      case IngredientType.Fruit:
        return this._fruitBuilder.build(ingredient);
    }
  }
}
