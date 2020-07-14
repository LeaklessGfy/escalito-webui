import { action, computed, observable } from 'mobx';

import { Service } from '../remote/Service';
import { CocktailExtended } from './dynamic/CocktailExtended';
import { IngredientExtended } from './dynamic/IngredientExtended';
import { Cocktail, CocktailKey } from './static/Cocktail';
import { Employee, EmployeeKey } from './static/Employee';
import { IngredientKey } from './static/Ingredient';
import { IngredientProvided } from './static/IngredientProvided';
import { ProviderKey } from './static/Provider';

export type IngredientMapper = Map<
  IngredientKey,
  Map<ProviderKey, IngredientExtended>
>;

export type CocktailMapper = Map<CocktailKey, CocktailExtended>;

export type EmployeeMapper = Map<EmployeeKey, Employee>;

export class Inventory {
  @observable
  private _cash: number;

  @observable
  private readonly _ingredients: IngredientMapper;

  @observable
  private readonly _cocktails: CocktailMapper;

  @observable
  private readonly _employees: EmployeeMapper;

  private $service?: Service;

  constructor(
    cash: number,
    ingredients: IngredientMapper = new Map(),
    cocktails: CocktailMapper = new Map(),
    employees: EmployeeMapper = new Map()
  ) {
    this._cash = cash;
    this._ingredients = ingredients;
    this._cocktails = cocktails;
    this._employees = employees;
  }

  public get cash(): number {
    return this._cash;
  }

  @computed
  public get cocktails(): CocktailExtended[] {
    return Array.from(this._cocktails.values());
  }

  @computed
  public get ingredients(): IngredientExtended[] {
    const allValues: IngredientExtended[] = [];
    for (const providers of this._ingredients.values()) {
      for (const ingredient of providers.values()) {
        allValues.push(ingredient);
      }
    }
    return allValues;
  }

  @computed
  public get employees(): Employee[] {
    return Array.from(this._employees.values());
  }

  public getGlobalIngredientStock(ingredientKey: IngredientKey): number {
    const providers = this._ingredients.get(ingredientKey);
    if (providers === undefined) {
      return 0;
    }
    return Array.from(providers.values()).reduce(
      (prev, next) => prev + next.stock,
      0
    );
  }

  public getIngredientStock(
    ingredientKey: IngredientKey,
    providerKey: ProviderKey
  ): number {
    const providers = this._ingredients.get(ingredientKey);
    if (providers === undefined) {
      return 0;
    }
    return providers.get(providerKey)?.stock ?? 0;
  }

  public isIngredientDisabled(ingredient: IngredientProvided): boolean {
    return (
      this._cash <
      ingredient.price *
        this.getIngredientStock(ingredient.base.key, ingredient.providerKey) +
        1
    );
  }

  @action
  public addIngredient(
    ingredientKey: IngredientKey,
    providerKey: ProviderKey
  ): void {
    const providers =
      this._ingredients.get(ingredientKey) ??
      new Map<ProviderKey, IngredientExtended>();
    const ingredientExtended = providers.get(providerKey);

    if (ingredientExtended === undefined) {
      // should create it or get it directly from arguments
      throw new Error('');
    }

    const newIngredientExtended = new IngredientExtended(
      ingredientExtended.provided,
      ingredientExtended.stock + 1
    );
    providers.set(providerKey, newIngredientExtended);

    this._ingredients.set(ingredientKey, providers);
    this.$service?.addIngredient(
      ingredientKey,
      providerKey,
      newIngredientExtended.stock
    );
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

    const ingredientExtended = providers.get(providerKey);
    if (ingredientExtended === undefined || ingredientExtended.stock === 0) {
      return;
    }

    const newStock = ingredientExtended.stock - 1;

    if (newStock > 0) {
      const newIngredientExtended = new IngredientExtended(
        ingredientExtended.provided,
        newStock
      );
      providers.set(providerKey, newIngredientExtended);
    } else {
      providers.delete(providerKey);
    }

    if (providers.size > 0) {
      this._ingredients.set(ingredientKey, providers);
    } else {
      this._ingredients.delete(ingredientKey);
    }

    this.$service?.removeIngredient(ingredientKey, providerKey, newStock);
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

  public hasEmployee(employeeKey: EmployeeKey): boolean {
    return this._employees.has(employeeKey);
  }

  @action
  public addEmployee(employee: Employee): void {
    if (this._cash < employee.price) {
      return;
    }

    this._cash -= employee.price;
    this._employees.set(employee.key, employee);
    this.$service?.setCash(this._cash);
    this.$service?.addEmployee(employee.key);
  }

  @action
  public removeEmployee(employeeKey: EmployeeKey): void {
    this._employees.delete(employeeKey);
    this.$service?.removeEmployee(employeeKey);
  }

  public attachService(service: Service): void {
    this.$service = service;
  }
}
