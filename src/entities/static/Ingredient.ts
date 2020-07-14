export enum IngredientKey {
  Rum,
  Cola,
  Lemonade,
  Lemon,
  Strawberry
}

export enum IngredientType {
  Bottle,
  Fruits
}

export const IngredientNames: { [key in IngredientKey]: string } = {
  [IngredientKey.Rum]: 'Rum',
  [IngredientKey.Cola]: 'Cola',
  [IngredientKey.Lemonade]: 'Lemonade',
  [IngredientKey.Lemon]: 'Lemon',
  [IngredientKey.Strawberry]: 'Strawberry'
};

const IngredientColors: { [key in IngredientKey]: number } = {
  [IngredientKey.Rum]: 0x00ff00,
  [IngredientKey.Cola]: 0x000000,
  [IngredientKey.Lemonade]: 0xff00ff,
  [IngredientKey.Lemon]: 0x00ffff,
  [IngredientKey.Strawberry]: 0xff0000
};

const IngredientTypes: { [key in IngredientKey]: IngredientType } = {
  [IngredientKey.Rum]: IngredientType.Bottle,
  [IngredientKey.Cola]: IngredientType.Bottle,
  [IngredientKey.Lemonade]: IngredientType.Bottle,
  [IngredientKey.Lemon]: IngredientType.Fruits,
  [IngredientKey.Strawberry]: IngredientType.Fruits
};

export class Ingredient {
  public readonly key: IngredientKey;
  public readonly name: string;
  public readonly amount: number;
  public readonly color: number;
  public readonly type: IngredientType;

  public constructor(key: IngredientKey, amount: number) {
    this.key = key;
    this.name = IngredientNames[key];
    this.amount = amount;
    this.color = IngredientColors[key];
    this.type = IngredientTypes[key];
  }
}
