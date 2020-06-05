export enum TriggerUnit {}

export class TimeTrigger {
  public readonly triggerTime: number;
  public readonly triggerUnit: TriggerUnit;
  public readonly triggerRepetition: number;

  constructor(
    triggerTime: number,
    triggerUnit: TriggerUnit,
    triggerRepetition: number = -1
  ) {
    this.triggerTime = triggerTime;
    this.triggerUnit = triggerUnit;
    this.triggerRepetition = triggerRepetition;
  }
}
