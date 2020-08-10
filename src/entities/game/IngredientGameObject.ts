import { IngredientProvided } from '../static/IngredientProvided';
import { IScene } from './IScene';

export interface IngredientGameObject {
  update(scene: IScene): void;
  addProvided(ingredient: IngredientProvided): void;
  removeProvided(ingredient: IngredientProvided): void;
  shouldDestroy(): boolean;
  destroy(): void;
}
