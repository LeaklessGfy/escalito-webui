import { Ingredient } from '../static/Ingredient';
import { IPoint } from './IPoint';
import { IScene } from './IScene';

export interface IEmitter {
  start(ingredient: Ingredient, point: IPoint): void;
  stop(): void;
  checkCollision(scene: IScene, ingredient: Ingredient): void;
  isEmitting(): boolean;
}
