import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';
import { IngredientGameObject } from '../../entities/game/IngredientGameObject';
import { IngredientKey } from '../../entities/static/Ingredient';
import { Store } from '../../store';
import { SpriteKey } from '../sprites/SpriteKey';

export class IngredientController implements IController {
  public static readonly KEY = Symbol();

  private readonly _ingredients: Map<
    IngredientKey,
    IngredientGameObject
  > = new Map();

  preload(scene: IScene): void {
    scene.load.image(SpriteKey.RumBottle, 'assets/bottle.rum.png');
  }

  create(scene: IScene): void {
    scene.inventory.watchIngredients(() => {});
  }

  update(scene: IScene, delta: number): void {}

  daily(scene: IScene, store: Store, day: number): void {}
}
