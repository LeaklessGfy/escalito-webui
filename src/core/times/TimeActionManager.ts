import { ITimeAction } from './ITimeAction';

export class TimeActionManager {
  private readonly _actions: Set<ITimeAction> = new Set();

  public add(action: ITimeAction): void {
    this._actions.add(action);
  }

  public update(delta: number): void {
    for (const action of this._actions) {
      if (action.shouldTrigger(delta)) {
        action.trigger();
      }
    }
  }
}
