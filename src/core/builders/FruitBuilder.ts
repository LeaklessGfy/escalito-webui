import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IScene } from '../../entities/game/IScene';

export class FruitBuilder {
  private readonly _scene: IScene;
  public readonly emitter: IEmitter;

  public constructor(scene: IScene, emitter: IEmitter) {
    this._scene = scene;
    this.emitter = emitter;
  }

  public build(ingredient: IngredientExtended): any {}
}
