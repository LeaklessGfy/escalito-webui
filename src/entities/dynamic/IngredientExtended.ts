import { IngredientProvided } from '../static/IngredientProvided';

export class IngredientExtended {
  public readonly provided: IngredientProvided;
  public readonly stock: number;

  public constructor(provided: IngredientProvided, stock: number) {
    this.provided = provided;
    this.stock = stock;
  }

  public clone(stock: number): IngredientExtended {
    return new IngredientExtended(this.provided, stock);
  }
}
