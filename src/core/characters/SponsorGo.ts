import { IBehavioral } from '../../entities/game/IBehavioral';
import { IPoint } from '../../entities/game/IPoint';
import { SponsorBuilder } from '../builders/SponsorBuilder';
import { AbstractCharacter } from './AbstractCharacter';

export class SponsorGo extends AbstractCharacter implements IBehavioral {
  public constructor(builder: SponsorBuilder) {
    super(builder.sprite, builder.spriteKey);
  }

  public behave(leader: IPoint | undefined, bar: IPoint, spawn: IPoint): void {
    if (this._state.leaving) {
      throw new Error('Client should not behave while leaving');
    }

    if (this._state.moving || this._state.waiting) {
      return;
    }

    let next = bar;
    let dist = 4;

    if (leader !== undefined) {
      next = leader;
      dist = this._sprite.displayWidth;
    }

    if (!this.isNear(next, dist)) {
      return this.moveTo(next, dist);
    }
  }
}
