import { TimeTrigger } from './TimeTrigger';

export class Investment {
  public readonly name: string;
  public readonly amount: number;
  public readonly penalty: number;
  public readonly trigger: TimeTrigger;
  public readonly requirements: Set<string>;

  constructor(
    name: string,
    amount: number,
    penalty: number,
    trigger: TimeTrigger,
    requirements: Set<string>
  ) {
    this.name = name;
    this.amount = amount;
    this.penalty = penalty;
    this.trigger = trigger;
    this.requirements = requirements;
  }
}
