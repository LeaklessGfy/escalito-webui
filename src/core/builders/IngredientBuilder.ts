import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IngredientType } from '../../entities/static/Ingredient';
import { IEmitter } from '../cocktails/IEmitter';
import { IIngredient } from '../cocktails/IIngredient';
import { IScene } from '../scenes/IScene';
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

  public build(): IIngredient {
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
