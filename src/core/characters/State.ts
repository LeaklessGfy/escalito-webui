enum StateKey {
  Idle,
  Move,
  Wait,
  Leave,
  Exhaust,
  Served
}

export class State {
  private readonly _states: Set<StateKey> = new Set();

  public constructor() {
    this._states.add(StateKey.Idle);
  }

  public get idling(): boolean {
    return this._states.has(StateKey.Idle);
  }

  public get moving(): boolean {
    return this._states.has(StateKey.Move);
  }

  public get waiting(): boolean {
    return this._states.has(StateKey.Wait);
  }

  public get leaving(): boolean {
    return this._states.has(StateKey.Leave);
  }

  public get exhausted(): boolean {
    return this._states.has(StateKey.Exhaust);
  }

  public get served(): boolean {
    return this._states.has(StateKey.Served);
  }

  public idle(): void {
    this._states.delete(StateKey.Move);
    this._states.add(StateKey.Idle);
  }

  public move(): void {
    this._states.delete(StateKey.Idle);
    this._states.add(StateKey.Move);
  }

  public wait(): void {
    this._states.delete(StateKey.Exhaust);
    this._states.add(StateKey.Wait);
  }

  public unWait(): void {
    this._states.delete(StateKey.Wait);
  }

  public leave(): void {
    this._states.delete(StateKey.Wait);
    this._states.add(StateKey.Leave);
  }

  public exhaust(): void {
    this._states.delete(StateKey.Wait);
    this._states.add(StateKey.Exhaust);
  }

  public serve(): void {
    this._states.delete(StateKey.Wait);
    this._states.add(StateKey.Served);
  }
}
