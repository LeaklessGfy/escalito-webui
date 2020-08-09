import { IngredientExtended } from '../dynamic/IngredientExtended';
import { IPoint } from './IPoint';
import { IScene } from './IScene';

export interface IEmitter {
  start(ingredient: IngredientExtended, point: IPoint): void;
  stop(): void;
  checkCollision(
    scene: IScene,
    ingredient: IngredientExtended,
    callback: Function
  ): void;
  isEmitting(): boolean;
}
