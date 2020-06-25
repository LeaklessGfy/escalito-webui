export interface ITimeAction {
  isEnable(currentTime: number): boolean;
  trigger(currentTime: number): void;
}
