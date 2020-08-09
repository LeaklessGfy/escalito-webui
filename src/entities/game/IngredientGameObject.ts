import { IScene } from './IScene';

export interface IngredientGameObject {
  update(scene: IScene): void;
  removeStock(nb: number): void;
}
