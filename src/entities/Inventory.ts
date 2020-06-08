import { action, observable } from 'mobx';

import { InventoryDTO } from '../dto/InventoryDTO';
import { Cocktail, CocktailExtended, CocktailKey } from './Cocktail';
import { IngredientExtended, IngredientKey } from './Ingredient';
import { ProviderKey } from './Provider';

export class Inventory {
  @observable
  private _cash: number;

  @observable
  private readonly _ingredients: Map<IngredientKey, Map<ProviderKey, number>>;

  @observable
  private readonly _cocktails: Map<CocktailKey, CocktailExtended>;

  constructor(
    cash: number,
    ingredients: Map<IngredientKey, Map<ProviderKey, number>> = new Map(),
    cocktails: Map<CocktailKey, CocktailExtended> = new Map()
  ) {
    this._cash = cash;
    this._ingredients = ingredients;
    this._cocktails = cocktails;
  }

  public get cash(): number {
    return this._cash;
  }

  public getIngredientStock(
    ingredientKey: IngredientKey,
    providerKey: ProviderKey
  ): number {
    const providers = this._ingredients.get(ingredientKey);
    if (providers === undefined) {
      return 0;
    }
    return providers.get(providerKey) ?? 0;
  }

  public isIngredientDisabled(ingredient: IngredientExtended): boolean {
    return (
      this._cash <
      ingredient.price *
        this.getIngredientStock(ingredient.key, ingredient.providerKey) +
        1
    );
  }

  @action
  public addIngredient(
    ingredientKey: IngredientKey,
    providerKey: ProviderKey
  ): void {
    const providers =
      this._ingredients.get(ingredientKey) ?? new Map<ProviderKey, number>();
    const value = providers.get(providerKey) ?? 0;
    providers.set(providerKey, value + 1);
    this._ingredients.set(ingredientKey, providers);
  }

  @action
  public removeIngredient(
    ingredientKey: IngredientKey,
    providerKey: ProviderKey
  ): void {
    const providers = this._ingredients.get(ingredientKey);
    if (providers === undefined) {
      return;
    }

    const value = providers.get(providerKey);
    if (value === undefined || value === 0) {
      return;
    }

    if (value > 1) {
      providers.set(providerKey, value - 1);
    } else {
      providers.delete(providerKey);
    }

    if (providers.size > 0) {
      this._ingredients.set(ingredientKey, providers);
    } else {
      this._ingredients.delete(ingredientKey);
    }
  }

  public getCocktailPrice(cocktailKey: CocktailKey): number {
    return this._cocktails.get(cocktailKey)?.price ?? 0;
  }

  public hasCocktail(cocktailKey: CocktailKey): boolean {
    return this._cocktails.has(cocktailKey);
  }

  public isCocktailDisabled(cocktail: Cocktail): boolean {
    const ingredients = cocktail.ingredients;

    for (const ingredient of ingredients) {
      if (!this._ingredients.has(ingredient)) {
        return true;
      }
    }

    return false;
  }

  @action
  public addCocktail(cocktail: Cocktail): void {
    if (this.isCocktailDisabled(cocktail)) {
      return;
    }
    this._cocktails.set(cocktail.key, new CocktailExtended(cocktail, 0, 0));
  }

  @action
  public removeCocktail(cocktailKey: CocktailKey): void {
    this._cocktails.delete(cocktailKey);
  }

  public static fromDTO(dto: InventoryDTO): Inventory {
    const ingredients = new Map<IngredientKey, Map<ProviderKey, number>>();
    for (const ingredientDto of dto.ingredients) {
      const providers =
        ingredients.get(ingredientDto.ingredient) ??
        new Map<ProviderKey, number>();
      const stock = providers.get(ingredientDto.provider) ?? 0;
      providers.set(ingredientDto.ingredient, stock + 1);
    }

    const cocktails = new Map<CocktailKey, CocktailExtended>();
    for (const cocktailDto of dto.cocktails) {
      const cocktail = CocktailExtended.buildExtended(
        cocktailDto.cocktail,
        cocktailDto.price,
        cocktailDto.hype
      );
      cocktails.set(cocktailDto.cocktail, cocktail);
    }

    return new Inventory(dto.cash, ingredients, cocktails);
  }
}
