import { IngredientKey, IngredientExtended } from './Ingredient';

export enum ProviderKey {
  SuperMarket
}

export class Provider {
  public readonly key: ProviderKey;
  public readonly name: string;
  public readonly ingredients: Map<IngredientKey, IngredientExtended>;

  constructor(
    key: ProviderKey,
    name: string,
    ingredients: Map<IngredientKey, IngredientExtended>
  ) {
    this.key = key;
    this.name = name;
    this.ingredients = ingredients;
  }

  static buildSuperMarket() {
    const ingredients = new Map();
    ingredients.set(IngredientKey.Rum, IngredientExtended.buildRum(5));

    return new Provider(ProviderKey.SuperMarket, 'Super Market', ingredients);
  }
}
