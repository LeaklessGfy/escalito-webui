import { IngredientKey } from '../static/Ingredient';
import { IngredientProvided } from '../static/IngredientProvided';
import { Provider, ProviderKey } from '../static/Provider';
import { Ingredients } from './Ingredients';

function buildProvided(
  key: IngredientKey,
  providerKey: ProviderKey,
  price: number
): IngredientProvided {
  const original = Ingredients().get(key);
  if (original === undefined) {
    throw new Error('Undefined ingredient key to build provided ' + key);
  }
  return new IngredientProvided(original, providerKey, price);
}

function buildSuperMarket(): Provider {
  const key = ProviderKey.SuperMarket;
  const ingredients = new Map<IngredientKey, IngredientProvided>();
  ingredients.set(IngredientKey.Rum, buildProvided(IngredientKey.Rum, key, 5));
  ingredients.set(
    IngredientKey.Cola,
    buildProvided(IngredientKey.Cola, key, 5)
  );
  ingredients.set(
    IngredientKey.Lemonade,
    buildProvided(IngredientKey.Lemonade, key, 5)
  );
  ingredients.set(
    IngredientKey.Lemon,
    buildProvided(IngredientKey.Lemon, key, 5)
  );
  ingredients.set(
    IngredientKey.Strawberry,
    buildProvided(IngredientKey.Strawberry, key, 5)
  );
  return new Provider(key, ingredients);
}

function buildProviders(): Map<ProviderKey, Provider> {
  const map = new Map<ProviderKey, Provider>();
  map.set(ProviderKey.SuperMarket, buildSuperMarket());
  return map;
}

let provider: Map<ProviderKey, Provider> | undefined = undefined;

export const Providers = () => {
  if (provider === undefined) {
    provider = buildProviders();
  }
  return provider;
};
