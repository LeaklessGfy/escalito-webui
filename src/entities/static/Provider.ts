import { IngredientKey } from './Ingredient';
import { IngredientProvided } from './IngredientProvided';

export enum ProviderKey {
  SuperMarket
}

export const ProviderNames: { [key in ProviderKey]: string } = {
  [ProviderKey.SuperMarket]: 'Super Market'
};

export class Provider {
  public readonly key: ProviderKey;
  public readonly name: string;
  public readonly ingredients: Map<IngredientKey, IngredientProvided>;

  public constructor(
    key: ProviderKey,
    ingredients: Map<IngredientKey, IngredientProvided>
  ) {
    this.key = key;
    this.name = ProviderNames[key];
    this.ingredients = ingredients;
  }

  public get ingredientsArray(): IngredientProvided[] {
    return Array.from(this.ingredients.values());
  }
}
