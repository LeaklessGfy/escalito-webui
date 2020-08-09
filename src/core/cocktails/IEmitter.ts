import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IScene } from '../scenes/IScene';
import { Point } from '../sprites/Point';

export interface IEmitter {
  start(ingredient: IngredientExtended, point: Point): void;
  stop(): void;
  checkCollision(
    scene: IScene,
    ingredient: IngredientExtended,
    callback: Function
  ): void;
  isEmitting(): boolean;
}
