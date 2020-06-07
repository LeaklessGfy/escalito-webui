import { IngredientKey } from './Ingredient';

export enum CocktailKey {
  Mojito,
  CubaLibra
}

export const CocktailNames: { [key in CocktailKey]: string } = {
  [CocktailKey.Mojito]: 'Mojito',
  [CocktailKey.CubaLibra]: 'Cuba Libre'
};

export class Cocktail {
  public readonly key: CocktailKey;
  public readonly name: string;
  private readonly recipe: Map<IngredientKey, number>;

  constructor(key: CocktailKey, recipe: Map<IngredientKey, number>) {
    this.key = key;
    this.name = CocktailNames[key];
    this.recipe = recipe;
  }

  public getIngredients(): IngredientKey[] {
    return Array.from(this.recipe.keys());
  }

  public getRecipe(): Map<IngredientKey, number> {
    return new Map(this.recipe);
  }

  public static build(cocktailKey: CocktailKey): Cocktail {
    const recipe = new Map();

    switch (cocktailKey) {
      case CocktailKey.Mojito:
        recipe.set(IngredientKey.Rum, 100);
        break;
      case CocktailKey.CubaLibra:
        recipe.set(IngredientKey.Rum, 50);
        recipe.set(IngredientKey.Cola, 50);
        recipe.set(IngredientKey.Lemon, 1);
        break;
    }

    return new Cocktail(cocktailKey, recipe);
  }
}

export class CocktailExtended extends Cocktail {
  public readonly price: number;
  public readonly hype: number;

  constructor(cocktail: Cocktail, price: number, hype: number) {
    super(cocktail.key, cocktail.getRecipe());
    this.price = price;
    this.hype = hype;
  }

  public static buildExtended(
    cocktailKey: CocktailKey,
    price: number,
    hype: number
  ) {
    return new CocktailExtended(Cocktail.build(cocktailKey), price, hype);
  }

  public static buildMojito() {
    const cocktail = Cocktail.build(CocktailKey.Mojito);
    const defaultPrice = 5;
    const defaultHype = 0;

    return new CocktailExtended(cocktail, defaultPrice, defaultHype);
  }

  public static buildCubaLibre() {
    const cocktail = Cocktail.build(CocktailKey.CubaLibra);
    const defaultPrice = 5;
    const defaultHype = 0;

    return new CocktailExtended(cocktail, defaultPrice, defaultHype);
  }
}
