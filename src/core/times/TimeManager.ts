import { ITimeAction } from './ITimeAction';

export class TimeManager {
  private readonly _actions: Set<ITimeAction> = new Set();

  public add(action: ITimeAction): void {
    this._actions.add(action);
  }

  public remove(action: ITimeAction): void {
    this._actions.delete(action);
  }

  public update(delta: number): void {
    for (const action of this._actions) {
      if (action.shouldTrigger(delta)) {
        action.trigger();
      }
    }
  }
}
