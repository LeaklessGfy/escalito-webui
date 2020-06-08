import { IngredientExtended, IngredientKey } from './Ingredient';

export enum ProviderKey {
  SuperMarket
}

export const ProviderNames: { [key in ProviderKey]: string } = {
  [ProviderKey.SuperMarket]: 'Super Market'
};

export class Provider {
  private readonly _key: ProviderKey;
  private readonly _ingredients: Map<IngredientKey, IngredientExtended>;

  constructor(
    key: ProviderKey,
    ingredients: Map<IngredientKey, IngredientExtended>
  ) {
    this._key = key;
    this._ingredients = ingredients;
  }

  public get key(): ProviderKey {
    return this._key;
  }

  public get name(): string {
    return ProviderNames[this._key];
  }

  public get ingredients(): IngredientExtended[] {
    return Array.from(this._ingredients.values());
  }

  public static buildSuperMarket() {
    const key = ProviderKey.SuperMarket;
    const ingredients = new Map();
    ingredients.set(
      IngredientKey.Rum,
      IngredientExtended.buildExtended(IngredientKey.Rum, key, 5)
    );
    ingredients.set(
      IngredientKey.Cola,
      IngredientExtended.buildExtended(IngredientKey.Cola, key, 5)
    );
    ingredients.set(
      IngredientKey.Lemonade,
      IngredientExtended.buildExtended(IngredientKey.Lemonade, key, 5)
    );
    ingredients.set(
      IngredientKey.Lemon,
      IngredientExtended.buildExtended(IngredientKey.Lemon, key, 5)
    );
    ingredients.set(
      IngredientKey.Strawberry,
      IngredientExtended.buildExtended(IngredientKey.Strawberry, key, 5)
    );
    return new Provider(key, ingredients);
  }
}

function buildProviders(): Map<ProviderKey, Provider> {
  const map: Map<ProviderKey, Provider> = new Map();
  map.set(ProviderKey.SuperMarket, Provider.buildSuperMarket());
  return map;
}

export const Providers = buildProviders();
