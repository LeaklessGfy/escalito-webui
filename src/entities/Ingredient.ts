export enum IngredientKey {
  Rum
}

export class Ingredient {
  public readonly key: IngredientKey;
  public readonly name: string;
  public readonly color: string;
  public readonly amount: number;

  constructor(key: IngredientKey, name: string, color: string, amount: number) {
    this.key = key;
    this.name = name;
    this.color = color;
    this.amount = amount;
  }
}

export class IngredientExtended extends Ingredient {
  public readonly price: number;

  constructor(ingredient: Ingredient, price: number) {
    super(ingredient.key, ingredient.name, ingredient.color, ingredient.amount);
    this.price = price;
  }

  public static buildRum(price: number) {
    const ingredient = new Ingredient(IngredientKey.Rum, 'Rum', '', 5);
    return new IngredientExtended(ingredient, price);
  }
}
