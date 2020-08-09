import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IScene } from '../../entities/game/IScene';

export class FruitBuilder {
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

  public build(): any {}
}
