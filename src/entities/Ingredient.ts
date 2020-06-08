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

export class Ingredient {
  private readonly _key: IngredientKey;
  private readonly _color: string;
  private readonly _amount: number;

  protected constructor(key: IngredientKey, color: string, amount: number) {
    this._key = key;
    this._color = color;
    this._amount = amount;
  }

  public get key(): IngredientKey {
    return this._key;
  }

  public get name(): string {
    return IngredientNames[this._key];
  }

  public get color(): string {
    return this._color;
  }

  public get amount(): number {
    return this._amount;
  }

  public static build(key: IngredientKey): Ingredient {
    switch (key) {
      case IngredientKey.Rum:
        return new Ingredient(IngredientKey.Rum, '', 1);
      case IngredientKey.Cola:
        return new Ingredient(IngredientKey.Cola, '', 1);
      case IngredientKey.Lemonade:
        return new Ingredient(IngredientKey.Lemonade, '', 1);
      case IngredientKey.Lemon:
        return new Ingredient(IngredientKey.Lemon, '', 1);
      case IngredientKey.Strawberry:
        return new Ingredient(IngredientKey.Strawberry, '', 1);
    }
  }
}

export class IngredientExtended extends Ingredient {
  private readonly _providerKey: ProviderKey;
  private readonly _price: number;
  private readonly _quality: number;

  constructor(
    ingredient: Ingredient,
    providerKey: ProviderKey,
    price: number,
    quality: number = 0
  ) {
    super(ingredient.key, ingredient.color, ingredient.amount);
    this._providerKey = providerKey;
    this._price = price;
    this._quality = quality;
  }

  public get providerKey(): ProviderKey {
    return this._providerKey;
  }

  public get price(): number {
    return this._price;
  }

  public get quality(): number {
    return this._quality;
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
