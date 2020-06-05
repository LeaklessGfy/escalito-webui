import { IngredientKey } from './Ingredient';

export enum CocktailKey {
  Mojito,
  CubaLibra
}

export class Cocktail {
  public readonly key: CocktailKey;
  public readonly name: string;
  public readonly recipe: Map<IngredientKey, number>;

  constructor(
    key: CocktailKey,
    name: string,
    recipe: Map<IngredientKey, number>
  ) {
    this.key = key;
    this.name = name;
    this.recipe = recipe;
  }
}

export class CocktailExtended extends Cocktail {
  public readonly price: number;
  public readonly hype: number;

  constructor(cocktail: Cocktail, price: number, hype: number) {
    super(cocktail.key, cocktail.name, cocktail.recipe);
    this.price = price;
    this.hype = hype;
  }
}
