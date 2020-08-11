import { TimeTrigger } from './TimeTrigger';

export class Loan {
  public readonly bank: string;
  public readonly amount: number;
  public readonly trigger: TimeTrigger;

  public constructor(bank: string, amount: number, trigger: TimeTrigger) {
    this.bank = bank;
    this.amount = amount;
    this.trigger = trigger;
  }
}
