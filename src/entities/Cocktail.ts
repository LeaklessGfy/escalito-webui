import { GlassKey } from './Glass';
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
  public readonly glassKey: GlassKey;
  public readonly recipe: Map<IngredientKey, number>;

  constructor(
    key: CocktailKey,
    glassKey: GlassKey,
    recipe: Map<IngredientKey, number>
  ) {
    this.key = key;
    this.glassKey = glassKey;
    this.recipe = recipe;
  }

  public get name(): string {
    return CocktailNames[this.key];
  }

  public get ingredients(): IngredientKey[] {
    return Array.from(this.recipe.keys());
  }

  public static build(key: CocktailKey): Cocktail {
    const recipe = new Map();

    switch (key) {
      case CocktailKey.Mojito:
        recipe.set(IngredientKey.Rum, 100);
        break;
      case CocktailKey.CubaLibra:
        recipe.set(IngredientKey.Rum, 50);
        recipe.set(IngredientKey.Cola, 50);
        recipe.set(IngredientKey.Lemon, 1);
        break;
    }

    return new Cocktail(key, GlassKey.Default, recipe);
  }
}

export class CocktailExtended extends Cocktail {
  public readonly price: number;
  public readonly hype: number;

  constructor(cocktail: Cocktail, price: number, hype: number) {
    super(cocktail.key, cocktail.glassKey, cocktail.recipe);
    this.price = price;
    this.hype = hype;
  }

  public static buildExtended(key: CocktailKey, price: number, hype: number) {
    const original = Cocktails.get(key);
    if (original === undefined) {
      throw new Error('Undefined cocktail key to build extended ' + key);
    }
    return new CocktailExtended(original, price, hype);
  }
}

function buildCocktails(): Map<CocktailKey, Cocktail> {
  const map: Map<CocktailKey, Cocktail> = new Map();
  map.set(CocktailKey.Mojito, Cocktail.build(CocktailKey.Mojito));
  map.set(CocktailKey.CubaLibra, Cocktail.build(CocktailKey.CubaLibra));
  return map;
}

export const Cocktails = buildCocktails();
