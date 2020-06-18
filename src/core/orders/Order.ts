import { CocktailExtended } from '../../entities/Cocktail';

export class Order {
  private readonly _cocktail: CocktailExtended;

  constructor(cocktail: CocktailExtended) {
    this._cocktail = cocktail;
  }

  public get price() {
    return this._cocktail.price;
  }
}
