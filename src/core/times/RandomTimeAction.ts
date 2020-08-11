import { TriggerUnit } from '../../entities/static/TimeTrigger';
import { DelegateTimeAction } from './DelegateTimeAction';

export class RandomTimeAction extends DelegateTimeAction {
  private readonly _triggerTimeStart: number;
  private readonly _triggerTimeEnd: number;

  public constructor(
    triggerTimeStart: number,
    triggerTimeEnd: number,
    triggerUnit: TriggerUnit,
    repetition: number,
    condition: () => boolean,
    action: () => void
  ) {
    super(
      RandomTimeAction.chooseBetween(triggerTimeStart, triggerTimeEnd),
      triggerUnit,
      repetition,
      condition,
      action
    );

    this._triggerTimeStart = triggerTimeStart;
    this._triggerTimeEnd = triggerTimeEnd;
  }

  protected action(): void {
    super.action();
    this._overflow = RandomTimeAction.chooseBetween(
      this._triggerTimeStart,
      this._triggerTimeEnd
    );
  }

  private static chooseBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
