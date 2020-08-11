import { IPoint } from './IPoint';

export interface IBehavioral {
  readonly position: IPoint;
  update(delta: number): void;
  behave(leader: IPoint | undefined, bar: IPoint, spawn: IPoint): void;
  isNear(point: IPoint | undefined, distance: number): boolean;
  destroy(): void;
}
