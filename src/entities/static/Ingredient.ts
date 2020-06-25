export enum IngredientKey {
  Rum,
  Cola,
  Lemonade,
  Lemon,
  Strawberry
}

const IngredientNames: { [key in IngredientKey]: string } = {
  [IngredientKey.Rum]: 'Rum',
  [IngredientKey.Cola]: 'Cola',
  [IngredientKey.Lemonade]: 'Lemonade',
  [IngredientKey.Lemon]: 'Lemon',
  [IngredientKey.Strawberry]: 'Strawberry'
};

const IngredientColors: { [key in IngredientKey]: string } = {
  [IngredientKey.Rum]: '',
  [IngredientKey.Cola]: '',
  [IngredientKey.Lemonade]: '',
  [IngredientKey.Lemon]: '',
  [IngredientKey.Strawberry]: ''
};

export class Ingredient {
  public readonly key: IngredientKey;
  public readonly amount: number;

  public constructor(key: IngredientKey, amount: number) {
    this.key = key;
    this.amount = amount;
  }

  public get name(): string {
    return IngredientNames[this.key];
  }

  public get color(): string {
    return IngredientColors[this.key];
  }
}
