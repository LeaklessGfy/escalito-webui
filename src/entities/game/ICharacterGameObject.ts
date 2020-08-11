import { IPoint } from './IPoint';

export interface ICharacterGameObject {
  readonly position: IPoint;

  update(delta: number): void;
  isNear(point: IPoint | undefined, distance: number): boolean;
  destroy(): void;
}
