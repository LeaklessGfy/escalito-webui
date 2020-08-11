import { IngredientExtended } from '../dynamic/IngredientExtended';
import { IScene } from './IScene';

export interface IIngredientGameObject {
  update(scene: IScene): void;
  addProvided(ingredient: IngredientExtended): void;
  removeProvided(ingredient: IngredientExtended): void;
  isEmpty(): boolean;
  destroy(): void;
}
