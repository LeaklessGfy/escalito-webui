import { Contract } from './Contract';

export class Sponsor {
  public readonly name: string;
  public readonly contract: Contract;

  public constructor(name: string, contract: Contract) {
    this.name = name;
    this.contract = contract;
  }
}
