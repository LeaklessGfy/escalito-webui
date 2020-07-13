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
  public readonly name: string;
  public readonly glassKey: GlassKey;
  public readonly recipe: Map<IngredientKey, number>;

  constructor(
    key: CocktailKey,
    glassKey: GlassKey,
    recipe: Map<IngredientKey, number>
  ) {
    this.key = key;
    this.name = CocktailNames[key];
    this.glassKey = glassKey;
    this.recipe = recipe;
  }

  public get ingredients(): IngredientKey[] {
    return Array.from(this.recipe.keys());
  }
}
