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
  public readonly key: IngredientKey;
  public readonly name: string;
  public readonly color: string;
  public readonly amount: number;

  constructor(key: IngredientKey, color: string, amount: number) {
    this.key = key;
    this.name = IngredientNames[key];
    this.color = color;
    this.amount = amount;
  }
}

export class IngredientExtended extends Ingredient {
  public readonly price: number;
  public quality: number = 0;

  constructor(ingredient: Ingredient, price: number) {
    super(ingredient.key, ingredient.color, ingredient.amount);
    this.price = price;
  }

  public static buildRum(price: number) {
    const ingredient = new Ingredient(IngredientKey.Rum, '', 1);
    return new IngredientExtended(ingredient, price);
  }

  public static buildCola(price: number) {
    const ingredient = new Ingredient(IngredientKey.Cola, '', 1);
    return new IngredientExtended(ingredient, price);
  }

  public static buildLemonade(price: number) {
    const ingredient = new Ingredient(IngredientKey.Lemonade, '', 1);
    return new IngredientExtended(ingredient, price);
  }

  public static buildLemon(price: number) {
    const ingredient = new Ingredient(IngredientKey.Lemon, '', 1);
    return new IngredientExtended(ingredient, price);
  }

  public static buildStrawberry(price: number) {
    const ingredient = new Ingredient(IngredientKey.Strawberry, '', 1);
    return new IngredientExtended(ingredient, price);
  }
}
