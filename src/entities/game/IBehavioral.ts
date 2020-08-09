import { IPoint } from './IPoint';

export interface IBehavioral {
  readonly position: IPoint;
  update(delta: number): void;
  behave(next: IPoint, bar: IPoint, spawn: IPoint): void;
  destroy(): void;
}
