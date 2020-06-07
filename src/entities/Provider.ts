import { IngredientKey, IngredientExtended } from './Ingredient';

export enum ProviderKey {
  SuperMarket
}

export const ProviderNames: { [key in ProviderKey]: string } = {
  [ProviderKey.SuperMarket]: 'Super Market'
};

export class Provider {
  public readonly key: ProviderKey;
  public readonly name: string;
  public readonly ingredients: Map<IngredientKey, IngredientExtended>;

  constructor(
    key: ProviderKey,
    ingredients: Map<IngredientKey, IngredientExtended>
  ) {
    this.key = key;
    this.name = ProviderNames[key];
    this.ingredients = ingredients;
  }

  public static buildSuperMarket() {
    const ingredients = new Map();
    ingredients.set(IngredientKey.Rum, IngredientExtended.buildRum(5));
    ingredients.set(IngredientKey.Cola, IngredientExtended.buildCola(5));
    ingredients.set(
      IngredientKey.Lemonade,
      IngredientExtended.buildLemonade(5)
    );
    ingredients.set(IngredientKey.Lemon, IngredientExtended.buildLemon(5));
    ingredients.set(
      IngredientKey.Strawberry,
      IngredientExtended.buildStrawberry(5)
    );

    return new Provider(ProviderKey.SuperMarket, ingredients);
  }
}
