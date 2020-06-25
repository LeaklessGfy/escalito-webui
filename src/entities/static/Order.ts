import { CocktailExtended } from '../dynamic/CocktailExtended';

export class Order {
  private readonly _cocktail: CocktailExtended;

  constructor(cocktail: CocktailExtended) {
    this._cocktail = cocktail;
  }

  public get price() {
    return this._cocktail.price;
  }

  public get title() {
    return this._cocktail.base.name;
  }
}
