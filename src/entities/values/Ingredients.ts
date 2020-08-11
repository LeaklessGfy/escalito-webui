import { IngredientExtended } from '../dynamic/IngredientExtended';
import { Ingredient, IngredientKey } from '../static/Ingredient';
import { ProviderKey } from '../static/Provider';
import { Providers } from './Providers';

export function buildIngredient(key: IngredientKey): Ingredient {
  switch (key) {
    case IngredientKey.Rum:
      return new Ingredient(IngredientKey.Rum);
    case IngredientKey.Cola:
      return new Ingredient(IngredientKey.Cola);
    case IngredientKey.Lemonade:
      return new Ingredient(IngredientKey.Lemonade);
    case IngredientKey.Lemon:
      return new Ingredient(IngredientKey.Lemon);
    case IngredientKey.Strawberry:
      return new Ingredient(IngredientKey.Strawberry);
  }
}

export function buildIngredientExtended(
  ingredientKey: IngredientKey,
  providerKey: ProviderKey,
  stock: number
): IngredientExtended {
  const provider = Providers().get(providerKey);

  if (provider === undefined) {
    throw new Error('Unknown provider with key ' + providerKey);
  }

  const provided = provider.ingredients.get(ingredientKey);

  if (provided === undefined) {
    throw new Error(
      'Unknown ingredient for provider ' + providerKey + ' : ' + ingredientKey
    );
  }

  return new IngredientExtended(provided, stock);
}

function buildIngredients(): Map<IngredientKey, Ingredient> {
  const map = new Map<IngredientKey, Ingredient>();
  map.set(IngredientKey.Rum, buildIngredient(IngredientKey.Rum));
  map.set(IngredientKey.Cola, buildIngredient(IngredientKey.Cola));
  map.set(IngredientKey.Lemonade, buildIngredient(IngredientKey.Lemonade));
  map.set(IngredientKey.Lemon, buildIngredient(IngredientKey.Lemon));
  map.set(IngredientKey.Strawberry, buildIngredient(IngredientKey.Strawberry));
  return map;
}

let ingredients: Map<IngredientKey, Ingredient> | undefined = undefined;

export const Ingredients = () => {
  if (ingredients === undefined) {
    ingredients = buildIngredients();
  }
  return ingredients;
};
