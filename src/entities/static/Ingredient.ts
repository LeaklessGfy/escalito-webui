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

const IngredientColors: { [key in IngredientKey]: number } = {
  [IngredientKey.Rum]: 0x00ff00,
  [IngredientKey.Cola]: 0x000000,
  [IngredientKey.Lemonade]: 0xff00ff,
  [IngredientKey.Lemon]: 0x00ffff,
  [IngredientKey.Strawberry]: 0xff0000
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

  public get color(): number {
    return IngredientColors[this.key];
  }
}
