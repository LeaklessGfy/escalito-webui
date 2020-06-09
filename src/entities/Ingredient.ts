import { ProviderKey } from './Provider';

export enum IngredientKey {
  Rum,
  Cola,
  Lemonade,
  Lemon,
  Strawberry
}

export const IngredientNames: { [key in IngredientKey]: string } = {
  [IngredientKey.Rum]: 'Rum',
  [IngredientKey.Cola]: 'Cola',
  [IngredientKey.Lemonade]: 'Lemonade',
  [IngredientKey.Lemon]: 'Lemon',
  [IngredientKey.Strawberry]: 'Strawberry'
};

export const IngredientColors: { [key in IngredientKey]: string } = {
  [IngredientKey.Rum]: '',
  [IngredientKey.Cola]: '',
  [IngredientKey.Lemonade]: '',
  [IngredientKey.Lemon]: '',
  [IngredientKey.Strawberry]: ''
};

export class Ingredient {
  public readonly key: IngredientKey;
  public readonly amount: number;

  protected constructor(key: IngredientKey, amount: number) {
    this.key = key;
    this.amount = amount;
  }

  public get name(): string {
    return IngredientNames[this.key];
  }

  public get color(): string {
    return IngredientColors[this.key];
  }

  public static build(key: IngredientKey): Ingredient {
    switch (key) {
      case IngredientKey.Rum:
        return new Ingredient(IngredientKey.Rum, 1);
      case IngredientKey.Cola:
        return new Ingredient(IngredientKey.Cola, 1);
      case IngredientKey.Lemonade:
        return new Ingredient(IngredientKey.Lemonade, 1);
      case IngredientKey.Lemon:
        return new Ingredient(IngredientKey.Lemon, 1);
      case IngredientKey.Strawberry:
        return new Ingredient(IngredientKey.Strawberry, 1);
    }
  }
}

export class IngredientExtended extends Ingredient {
  public readonly providerKey: ProviderKey;
  public readonly price: number;
  public readonly quality: number;

  constructor(
    ingredient: Ingredient,
    providerKey: ProviderKey,
    price: number,
    quality: number = 0
  ) {
    super(ingredient.key, ingredient.amount);
    this.providerKey = providerKey;
    this.price = price;
    this.quality = quality;
  }

  public static buildExtended(
    key: IngredientKey,
    providerKey: ProviderKey,
    price: number
  ): IngredientExtended {
    const original = Ingredients.get(key);
    if (original === undefined) {
      throw new Error('Undefined ingredient key to build extended ' + key);
    }
    return new IngredientExtended(original, providerKey, price);
  }
}

function buildIngredients(): Map<IngredientKey, Ingredient> {
  const map: Map<IngredientKey, Ingredient> = new Map();
  map.set(IngredientKey.Rum, Ingredient.build(IngredientKey.Rum));
  map.set(IngredientKey.Cola, Ingredient.build(IngredientKey.Cola));
  map.set(IngredientKey.Lemonade, Ingredient.build(IngredientKey.Lemonade));
  map.set(IngredientKey.Lemon, Ingredient.build(IngredientKey.Lemon));
  map.set(IngredientKey.Strawberry, Ingredient.build(IngredientKey.Strawberry));
  return map;
}

export const Ingredients = buildIngredients();
