import { ITimeAction } from './ITimeAction';

export class TimeActionManager {
  private readonly _actions: Set<ITimeAction> = new Set();
  private currentTime: number = 0;

  public add(action: ITimeAction): void {
    this._actions.add(action);
  }

  public tick(delta: number): void {
    this.currentTime += delta; // convert this as game clock ?

    for (const action of this._actions) {
      if (action.isEnable(this.currentTime)) {
        action.trigger(this.currentTime);
      }
    }
  }
}
