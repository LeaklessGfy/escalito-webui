import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IIngredientGameObject } from '../../entities/game/IIngredientGameObject';
import { IScene } from '../../entities/game/IScene';
import { IngredientType } from '../../entities/static/Ingredient';
import { BottleBuilder } from './BottleBuilder';
import { FruitBuilder } from './FruitBuilder';

export class IngredientBuilder {
  private readonly _scene: IScene;
  private readonly _emitter: IEmitter;
  private readonly _ingredient: IngredientExtended;

  public constructor(
    scene: IScene,
    emitter: IEmitter,
    ingredient: IngredientExtended
  ) {
    this._scene = scene;
    this._emitter = emitter;
    this._ingredient = ingredient;
  }

  public build(): IIngredientGameObject {
    switch (this._ingredient.provided.base.type) {
      case IngredientType.Bottle:
        return new BottleBuilder(
          this._scene,
          this._emitter,
          this._ingredient
        ).build();
      case IngredientType.Fruit:
        return new FruitBuilder(
          this._scene,
          this._emitter,
          this._ingredient
        ).build();
    }
  }
}
