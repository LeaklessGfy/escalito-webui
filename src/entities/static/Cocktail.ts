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
  public readonly name: string;
  public readonly recipe: Map<IngredientKey, number>;

  public constructor(
    key: CocktailKey,
    glassKey: GlassKey,
    recipe: Map<IngredientKey, number>
  ) {
    this.key = key;
    this.glassKey = glassKey;
    this.name = CocktailNames[key];
    this.recipe = recipe;
  }

  public get ingredients(): IngredientKey[] {
    return Array.from(this.recipe.keys());
  }
}
