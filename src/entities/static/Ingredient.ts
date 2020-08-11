export enum IngredientKey {
  Rum,
  Cola,
  Lemonade,
  Lemon,
  Strawberry
}

export enum IngredientType {
  Bottle,
  Fruit
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
  [IngredientKey.Lemon]: IngredientType.Fruit,
  [IngredientKey.Strawberry]: IngredientType.Fruit
};

const IngredientAmounts: { [key in IngredientType]: number } = {
  [IngredientType.Bottle]: 500,
  [IngredientType.Fruit]: 1
};

export class Ingredient {
  public readonly key: IngredientKey;
  public readonly type: IngredientType;
  public readonly name: string;
  public readonly color: number;
  public readonly amount: number;

  public constructor(key: IngredientKey) {
    this.key = key;
    this.type = IngredientTypes[key];
    this.name = IngredientNames[key];
    this.color = IngredientColors[key];
    this.amount = IngredientAmounts[this.type];
  }
}
