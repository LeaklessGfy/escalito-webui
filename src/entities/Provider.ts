import { IngredientExtended, IngredientKey } from './Ingredient';

export enum ProviderKey {
  SuperMarket
}

export const ProviderNames: { [key in ProviderKey]: string } = {
  [ProviderKey.SuperMarket]: 'Super Market'
};

export class Provider {
  public readonly key: ProviderKey;
  public readonly ingredients: Map<IngredientKey, IngredientExtended>;

  constructor(
    key: ProviderKey,
    ingredients: Map<IngredientKey, IngredientExtended>
  ) {
    this.key = key;
    this.ingredients = ingredients;
  }

  public get name(): string {
    return ProviderNames[this.key];
  }

  public get ingredientsArray(): IngredientExtended[] {
    return Array.from(this.ingredients.values());
  }

  public static buildSuperMarket() {
    const key = ProviderKey.SuperMarket;
    const ingredients = new Map();
    ingredients.set(
      IngredientKey.Rum,
      IngredientExtended.buildExtended(IngredientKey.Rum, key, 5, 0)
    );
    ingredients.set(
      IngredientKey.Cola,
      IngredientExtended.buildExtended(IngredientKey.Cola, key, 5, 0)
    );
    ingredients.set(
      IngredientKey.Lemonade,
      IngredientExtended.buildExtended(IngredientKey.Lemonade, key, 5, 0)
    );
    ingredients.set(
      IngredientKey.Lemon,
      IngredientExtended.buildExtended(IngredientKey.Lemon, key, 5, 0)
    );
    ingredients.set(
      IngredientKey.Strawberry,
      IngredientExtended.buildExtended(IngredientKey.Strawberry, key, 5, 0)
    );
    return new Provider(key, ingredients);
  }

  public static buildIngredient(
    ingredientKey: IngredientKey,
    providerKey: ProviderKey,
    stock: number
  ): IngredientExtended {
    const provider = Providers.get(providerKey);

    if (provider === undefined) {
      throw new Error('Unknown provider with key ' + providerKey);
    }

    const ingredient = provider.ingredients.get(ingredientKey);

    if (ingredient === undefined) {
      throw new Error(
        'Unknown ingredient for provider ' + providerKey + ' : ' + ingredientKey
      );
    }

    ingredient.stock = stock;

    return ingredient;
  }
}

function buildProviders(): Map<ProviderKey, Provider> {
  const map: Map<ProviderKey, Provider> = new Map();
  map.set(ProviderKey.SuperMarket, Provider.buildSuperMarket());
  return map;
}

export const Providers = buildProviders();
