import { IScene } from '../scenes/IScene';

export interface IIngredient {
  update(scene: IScene): void;
  removeStock(nb: number): void;
}
