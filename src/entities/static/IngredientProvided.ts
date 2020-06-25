import { Ingredient } from './Ingredient';
import { ProviderKey } from './Provider';

export class IngredientProvided {
  public readonly base: Ingredient;
  public readonly providerKey: ProviderKey;
  public readonly price: number;
  public readonly quality: number;

  public constructor(
    base: Ingredient,
    providerKey: ProviderKey,
    price: number,
    quality: number = 0
  ) {
    this.base = base;
    this.providerKey = providerKey;
    this.price = price;
    this.quality = quality;
  }
}
