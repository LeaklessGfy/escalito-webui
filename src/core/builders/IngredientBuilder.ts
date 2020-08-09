import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IScene } from '../../entities/game/IScene';
import { IngredientGameObject } from '../../entities/game/IngredientGameObject';
import { IngredientType } from '../../entities/static/Ingredient';
import { BottleBuilder } from './BottleBuilder';
import { FruitBuilder } from './FruitBuilder';

export class IngredientBuilder {
  private readonly _scene: IScene;
  private readonly _ingredient: IngredientExtended;
  private readonly _emitter: IEmitter;

  constructor(
    scene: IScene,
    ingredient: IngredientExtended,
    emitter: IEmitter
  ) {
    this._scene = scene;
    this._ingredient = ingredient;
    this._emitter = emitter;
  }

  public build(): IngredientGameObject {
    switch (this._ingredient.provided.base.type) {
      case IngredientType.Bottle:
        return new BottleBuilder(
          this._scene,
          this._ingredient,
          this._emitter
        ).build();
      case IngredientType.Fruit:
        return new FruitBuilder(
          this._scene,
          this._ingredient,
          this._emitter
        ).build();
    }
  }
}
