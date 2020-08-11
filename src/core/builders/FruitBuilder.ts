import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IScene } from '../../entities/game/IScene';

export class FruitBuilder {
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

  public build(): any {}
}
