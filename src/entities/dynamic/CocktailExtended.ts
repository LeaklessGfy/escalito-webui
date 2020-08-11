import { Cocktail } from '../static/Cocktail';

export class CocktailExtended {
  public readonly base: Cocktail;
  public readonly price: number;
  public readonly hype: number;

  public constructor(base: Cocktail, price: number, hype: number) {
    this.base = base;
    this.price = price;
    this.hype = hype;
  }
}
