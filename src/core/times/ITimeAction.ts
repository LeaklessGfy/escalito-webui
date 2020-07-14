export interface ITimeAction {
  shouldTrigger(delta: number): boolean;
  trigger(): void;
}
