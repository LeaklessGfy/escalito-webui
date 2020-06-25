import { CocktailExtended } from '../dynamic/CocktailExtended';
import { Cocktail, CocktailKey } from '../static/Cocktail';
import { GlassKey } from '../static/Glass';
import { IngredientKey } from '../static/Ingredient';

export function buildCocktail(key: CocktailKey): Cocktail {
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

export function buildCocktailExtended(
  key: CocktailKey,
  price: number,
  hype: number
) {
  const original = Cocktails().get(key);
  if (original === undefined) {
    throw new Error('Undefined cocktail key to build extended ' + key);
  }
  return new CocktailExtended(original, price, hype);
}

function buildCocktails(): Map<CocktailKey, Cocktail> {
  const map = new Map<CocktailKey, Cocktail>();
  map.set(CocktailKey.Mojito, buildCocktail(CocktailKey.Mojito));
  map.set(CocktailKey.CubaLibra, buildCocktail(CocktailKey.CubaLibra));
  return map;
}

let cocktails: Map<CocktailKey, Cocktail> | undefined = undefined;

export const Cocktails = () => {
  if (cocktails === undefined) {
    cocktails = buildCocktails();
  }
  return cocktails;
};
