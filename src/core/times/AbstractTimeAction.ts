import { TriggerUnit } from '../../entities/static/TimeTrigger';
import { ClockController } from '../controllers/ClockController';
import { ITimeAction } from './ITimeAction';

export abstract class AbstractTimeAction implements ITimeAction {
  private readonly _overflow: number;
  private _delta: number;
  private _repetion: number;

  constructor(
    triggerTime: number,
    triggerUnit: TriggerUnit,
    repetition: number = -1
  ) {
    this._overflow = ClockController.computeOverflow(triggerTime, triggerUnit);
    this._delta = 0;
    this._repetion = repetition;
  }

  public shouldTrigger(delta: number): boolean {
    const shouldRepeat = this._repetion === -1 || this._repetion > 0;

    if (!shouldRepeat) {
      return false;
    }

    this._delta += delta;

    if (this._delta < this._overflow) {
      return false;
    }

    return this.condition();
  }

  public trigger(): void {
    this._delta = 0;
    this._repetion =
      this._repetion === -1 ? this._repetion : this._repetion - 1;
    this.action();
  }

  protected abstract condition(): boolean;
  protected abstract action(): void;
}
