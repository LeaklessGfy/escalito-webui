import { Point } from '../positions/Point';
import { AbstractCharacter } from './AbstractCharacter';

export class Client extends AbstractCharacter {
  public behave(next: Point, bar: Point, spawn: Point): void {
    if (this._state.leaving) {
      throw new Error('Client should not behave while leaving');
    }

    if (this._state.moving || this._state.waiting) {
      return;
    }

    if (this._state.exhausted) {
      return this.leaveTo(spawn);
    }

    if (!this.isNear(next, 4)) {
      this.moveTo(next, 4);
    }

    if (this._order === undefined && this.isNear(bar, 4)) {
      this.askOrder();
      this.await();
    }
  }
}
