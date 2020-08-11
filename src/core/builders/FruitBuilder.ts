import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IScene } from '../../entities/game/IScene';

export class FruitBuilder {
  private readonly _scene: IScene;
  private readonly _emitter: IEmitter;

  public constructor(scene: IScene, emitter: IEmitter) {
    this._scene = scene;
    this._emitter = emitter;
  }

  public build(ingredient: IngredientExtended): any {}
}
