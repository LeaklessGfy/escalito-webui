import { CocktailExtended } from '../dynamic/CocktailExtended';
import { IngredientKey } from './Ingredient';

export class Order {
  private readonly _cocktail: CocktailExtended;

  public constructor(cocktail: CocktailExtended) {
    this._cocktail = cocktail;
  }

  public get price(): number {
    return this._cocktail.price;
  }

  public get title(): string {
    return this._cocktail.base.name;
  }

  public get recipe(): Map<IngredientKey, number> {
    return this._cocktail.base.recipe;
  }
}
