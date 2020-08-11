import { TriggerUnit } from '../../entities/static/TimeTrigger';
import { AbstractTimeAction } from './AbstractTimeAction';

export class DelegateTimeAction extends AbstractTimeAction {
  private readonly _condition: () => boolean;
  private readonly _action: () => void;

  public constructor(
    triggerTime: number,
    triggerUnit: TriggerUnit,
    repetition: number,
    condition: () => boolean,
    action: () => void
  ) {
    super(triggerTime, triggerUnit, repetition);
    this._condition = condition;
    this._action = action;
  }

  protected condition(): boolean {
    return this._condition();
  }

  protected action(): void {
    this._action();
  }
}
