import { TriggerUnit } from '../../entities/TimeTrigger';
import { ClockController } from '../controllers/ClockController';
import { ITimeAction } from './ITimeAction';

export abstract class AbstractTimeAction implements ITimeAction {
  private readonly _overflow: number;
  private _nextTime: number;
  private _repetion: number;

  constructor(
    triggerTime: number,
    triggerUnit: TriggerUnit,
    repetition: number = -1
  ) {
    this._overflow = ClockController.computeOverflow(triggerTime, triggerUnit);
    this._nextTime = this._overflow;
    this._repetion = repetition;
  }

  isEnable(currentTime: number): boolean {
    const shouldRepeat = this._repetion === -1 || this._repetion > 0;
    return shouldRepeat && this.condition() && currentTime < this._nextTime;
  }

  trigger(currentTime: number): void {
    this._nextTime = currentTime + this._overflow;
    this._repetion =
      this._repetion === -1 ? this._repetion : this._repetion - 1;
    this.action();
  }

  protected abstract condition(): boolean;
  protected abstract action(): void;
}
