export class Contract {
  public readonly price: number;
  public readonly bonus: number;
  public readonly penalty: number;

  constructor(price: number, bonus: number, penalty: number) {
    this.price = price;
    this.bonus = bonus;
    this.penalty = penalty;
  }
}
