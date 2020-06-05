import { observable } from 'mobx';

import { IngredientKey } from './Ingredient';
import { ProviderKey } from './Provider';

export class Inventory {
  public cash: number;

  @observable
  public readonly ingredients: Map<ProviderKey, Map<IngredientKey, number>>;

  constructor(
    cash: number,
    ingredients: Map<ProviderKey, Map<IngredientKey, number>>
  ) {
    this.cash = cash;
    this.ingredients = ingredients;
  }

  public getStock(provider: ProviderKey, ingredient: IngredientKey): number {
    const ingredients = this.ingredients.get(provider);
    if (ingredients === undefined) {
      return 0;
    }
    return ingredients.get(ingredient) ?? 0;
  }

  public addIngredient(provider: ProviderKey, ingredient: IngredientKey): void {
    const ingredients = this.ingredients.get(provider) ?? new Map();
    const value = ingredients.get(ingredient) ?? 0;
    ingredients.set(ingredient, value + 1);
    this.ingredients.set(provider, ingredients);
  }

  public removeIngredient(
    provider: ProviderKey,
    ingredient: IngredientKey
  ): void {
    const ingredients = this.ingredients.get(provider);
    if (ingredients === undefined) {
      return;
    }
    const value = ingredients.get(ingredient);
    if (value === undefined || value === 0) {
      return;
    }
    ingredients.set(ingredient, value - 1);
    this.ingredients.set(provider, ingredients);
  }
}
