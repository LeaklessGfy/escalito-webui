enum StateKey {
  Idle,
  Move,
  Wait,
  Leave,
  Exhaust
}

export class State {
  private readonly _states: Set<StateKey> = new Set();

  constructor() {
    this._states.add(StateKey.Idle);
  }

  public get idling() {
    return this._states.has(StateKey.Idle);
  }

  public get moving() {
    return this._states.has(StateKey.Move);
  }

  public get waiting() {
    return this._states.has(StateKey.Wait);
  }

  public get leaving() {
    return this._states.has(StateKey.Leave);
  }

  public get exhausted() {
    return this._states.has(StateKey.Exhaust);
  }

  public idle() {
    this._states.delete(StateKey.Move);
    this._states.add(StateKey.Idle);
  }

  public move() {
    this._states.delete(StateKey.Idle);
    this._states.add(StateKey.Move);
  }

  public wait() {
    this._states.delete(StateKey.Exhaust);
    this._states.add(StateKey.Wait);
  }

  public unWait() {
    this._states.delete(StateKey.Wait);
  }

  public leave() {
    this._states.delete(StateKey.Wait);
    this._states.add(StateKey.Leave);
  }

  public exhaust() {
    this._states.delete(StateKey.Wait);
    this._states.add(StateKey.Exhaust);
  }
}
