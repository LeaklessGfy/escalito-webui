import { IPoint } from './IPoint';

export interface ICharacterGameObject {
  readonly position: IPoint;
  onLeave?: Function;

  update(delta: number): void;
  isNear(point: IPoint | undefined, distance: number): boolean;
  destroy(): void;
}
