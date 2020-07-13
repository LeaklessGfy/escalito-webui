import { Point } from '../sprites/Point';

export interface IBehavioral {
  behave(next: Point, bar: Point, spawn: Point): void;
}
