import { observable, action, computed } from 'mobx';

import { IngredientKey, IngredientExtended } from './Ingredient';
import { ProviderKey } from './Provider';
import { CocktailKey, CocktailExtended } from './Cocktail';
import { InventoryDTO } from '../dto/InventoryDTO';

export class Inventory {
  public readonly user: number = 1;

  public cash: number;

  @observable
  private readonly ingredients: Map<ProviderKey, Map<IngredientKey, number>>;

  @observable
  private readonly cocktails: Map<CocktailKey, CocktailExtended>;

  constructor(cash: number) {
    this.cash = cash;
    this.ingredients = new Map();
    this.cocktails = new Map();
  }

  public getStock(provider: ProviderKey, ingredient: IngredientKey): number {
    const ingredients = this.ingredients.get(provider);
    if (ingredients === undefined) {
      return 0;
    }
    return ingredients.get(ingredient) ?? 0;
  }

  public isIngredientDisabled(
    provider: ProviderKey,
    ingredient: IngredientExtended
  ): boolean {
    return (
      this.cash < ingredient.price * this.getStock(provider, ingredient.key) + 1
    );
  }

  @action
  public addIngredient(provider: ProviderKey, ingredient: IngredientKey): void {
    const ingredients = this.ingredients.get(provider) ?? new Map();
    const value = ingredients.get(ingredient) ?? 0;
    ingredients.set(ingredient, value + 1);
    this.ingredients.set(provider, ingredients);
  }

  @action
  public removeIngredient(
    provider: ProviderKey,
    ingredient: IngredientKey
  ): void {
    const ingredients = this.ingredients.get(provider);
    if (ingredients === undefined) {
      return;
    }
    const value = ingredients.get(ingredient);
    if (value === undefined || value === 0) {
      return;
    }
    if (value > 1) {
      ingredients.set(ingredient, value - 1);
    } else {
      ingredients.delete(ingredient);
    }
    this.ingredients.set(provider, ingredients);
  }

  public hasCocktail(cocktail: CocktailExtended) {
    return this.cocktails.has(cocktail.key);
  }

  public isCocktailDisabled(cocktail: CocktailExtended): boolean {
    const recipe = cocktail.getRecipe();
    const availableIngredients = this.availableIngredients;

    for (const ingredient of recipe.keys()) {
      if (!availableIngredients.has(ingredient)) {
        return true;
      }
    }

    return false;
  }

  @action
  public addCocktail(cocktail: CocktailExtended): void {
    // Check requirements for cocktail : ingredients
    this.cocktails.set(cocktail.key, cocktail);
  }

  @action
  public removeCocktail(cocktail: CocktailExtended): void {
    this.cocktails.delete(cocktail.key);
  }

  @computed
  public get availableIngredients(): Set<IngredientKey> {
    return Array.from(this.ingredients.values()).reduce((set, map) => {
      for (const key of map.keys()) {
        set.add(key);
      }
      return set;
    }, new Set<IngredientKey>());
  }

  public static fromDTO(dto: InventoryDTO): Inventory {
    const inventory = new Inventory(dto.cash);

    const ingredients = new Map<ProviderKey, Map<IngredientKey, number>>();
    for (const ingredientDto of dto.ingredients) {
      const providers = ingredients.get(ingredientDto.provider) ?? new Map();
      const stock = providers.get(ingredientDto.ingredient) ?? 0;
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

    return inventory;
  }
}
