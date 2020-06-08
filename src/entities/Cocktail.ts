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
  private readonly _key: CocktailKey;
  private readonly _recipe: Map<IngredientKey, number>;

  constructor(key: CocktailKey, recipe: Map<IngredientKey, number>) {
    this._key = key;
    this._recipe = recipe;
  }

  public get key(): CocktailKey {
    return this._key;
  }

  public get name(): string {
    return CocktailNames[this._key];
  }

  public get ingredients(): IngredientKey[] {
    return Array.from(this._recipe.keys());
  }

  public get recipe(): Map<IngredientKey, number> {
    return new Map(this._recipe);
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

    return new Cocktail(key, recipe);
  }
}

export class CocktailExtended extends Cocktail {
  private readonly _price: number;
  private readonly _hype: number;

  constructor(cocktail: Cocktail, price: number, hype: number) {
    super(cocktail.key, cocktail.recipe);
    this._price = price;
    this._hype = hype;
  }

  public get price(): number {
    return this._price;
  }

  public get hype(): number {
    return this._hype;
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
