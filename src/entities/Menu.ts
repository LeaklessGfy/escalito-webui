import { CocktailKey, CocktailExtended } from './Cocktail';

export class Menu {
  public readonly cocktails: Map<CocktailKey, CocktailExtended>;

  constructor(cocktails: Map<CocktailKey, CocktailExtended>) {
    this.cocktails = cocktails;
  }
}
