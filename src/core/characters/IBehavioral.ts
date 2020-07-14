import { Point } from '../sprites/Point';

export interface IBehavioral {
  readonly position: Point;
  update(delta: number): void;
  behave(next: Point, bar: Point, spawn: Point): void;
  destroy(): void;
}
