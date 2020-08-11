import { action, computed, observable } from 'mobx';
import { IObservableValue } from 'mobx/lib/internal';

import { Service } from '../remote/Service';
import { CocktailExtended } from './dynamic/CocktailExtended';
import { IngredientExtended } from './dynamic/IngredientExtended';
import { Cocktail, CocktailKey } from './static/Cocktail';
import { Employee, EmployeeKey } from './static/Employee';
import { IngredientKey } from './static/Ingredient';
import { IngredientProvided } from './static/IngredientProvided';
import { ProviderKey } from './static/Provider';
import { buildIngredientExtended } from './values/Ingredients';

export type IngredientMapper = Map<
  IngredientKey,
  Map<ProviderKey, IngredientExtended>
>;
export type CocktailMapper = Map<CocktailKey, CocktailExtended>;
export type EmployeeMapper = Map<EmployeeKey, Employee>;

export class Inventory {
  private readonly $service: Service;

  public cash$: IObservableValue<number>;

  @observable
  public readonly ingredients$: IngredientMapper;

  @observable
  public readonly cocktails$: CocktailMapper;

  @observable
  public readonly employees$: EmployeeMapper;

  public constructor(
    service: Service,
    cash: number,
    ingredients: IngredientMapper = new Map(),
    cocktails: CocktailMapper = new Map(),
    employees: EmployeeMapper = new Map()
  ) {
    this.$service = service;
    this.cash$ = observable.box(cash);
    this.ingredients$ = ingredients;
    this.cocktails$ = cocktails;
    this.employees$ = employees;
  }

  public get cash(): number {
    return this.cash$.get();
  }

  @computed
  public get cocktails(): CocktailExtended[] {
    return Array.from(this.cocktails$.values());
  }

  @computed
  public get ingredients(): IngredientExtended[] {
    const allValues: IngredientExtended[] = [];
    for (const providers of this.ingredients$.values()) {
      for (const ingredient of providers.values()) {
        allValues.push(ingredient);
      }
    }
    return allValues;
  }

  @computed
  public get employees(): Employee[] {
    return Array.from(this.employees$.values());
  }

  public getGlobalIngredientStock(ingredientKey: IngredientKey): number {
    const providers = this.ingredients$.get(ingredientKey);
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
    const providers = this.ingredients$.get(ingredientKey);
    if (providers === undefined) {
      return 0;
    }
    return providers.get(providerKey)?.stock ?? 0;
  }

  public isIngredientDisabled(ingredient: IngredientProvided): boolean {
    return this.cash$.get() < ingredient.price;
  }

  @action
  public addIngredient(
    ingredientKey: IngredientKey,
    providerKey: ProviderKey
  ): void {
    const providers =
      this.ingredients$.get(ingredientKey) ??
      new Map<ProviderKey, IngredientExtended>();
    const ingredientExtended =
      providers.get(providerKey) ??
      buildIngredientExtended(ingredientKey, providerKey, 0);

    if (this.cash$.get() < ingredientExtended.provided.price) {
      throw new Error('Can not buy ingredient, too expensive');
    }

    const newStock = ingredientExtended.stock + 1;
    const newIngredientExtended = ingredientExtended.clone(newStock);
    providers.set(providerKey, newIngredientExtended);

    this.ingredients$.set(ingredientKey, providers);
    this.$service.addIngredient(
      ingredientKey,
      providerKey,
      newIngredientExtended.stock
    );

    const newCash = this.cash$.get() - ingredientExtended.provided.price;
    this.cash$.set(newCash);
    this.$service.setCash(newCash);
  }

  @action
  public removeIngredient(
    ingredientKey: IngredientKey,
    providerKey: ProviderKey
  ): void {
    const providers = this.ingredients$.get(ingredientKey);
    if (providers === undefined) {
      return;
    }

    const ingredientExtended = providers.get(providerKey);
    if (ingredientExtended === undefined || ingredientExtended.stock === 0) {
      return;
    }

    const newStock = ingredientExtended.stock - 1;

    if (newStock > 0) {
      const newIngredientExtended = ingredientExtended.clone(newStock);
      providers.set(providerKey, newIngredientExtended);
    } else {
      providers.delete(providerKey);
    }

    if (providers.size > 0) {
      this.ingredients$.set(ingredientKey, providers);
    } else {
      this.ingredients$.delete(ingredientKey);
    }

    this.$service.removeIngredient(ingredientKey, providerKey, newStock);
  }

  public getCocktailPrice(cocktailKey: CocktailKey): number {
    return this.cocktails$.get(cocktailKey)?.price ?? 0;
  }

  public hasCocktail(cocktailKey: CocktailKey): boolean {
    return this.cocktails$.has(cocktailKey);
  }

  public isCocktailDisabled(cocktail: Cocktail): boolean {
    const ingredients = cocktail.ingredients;

    for (const ingredient of ingredients) {
      if (!this.ingredients$.has(ingredient)) {
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
    this.cocktails$.set(cocktail.key, new CocktailExtended(cocktail, 0, 0));
  }

  @action
  public removeCocktail(cocktailKey: CocktailKey): void {
    this.cocktails$.delete(cocktailKey);
  }

  public hasEmployee(employeeKey: EmployeeKey): boolean {
    return this.employees$.has(employeeKey);
  }

  @action
  public addEmployee(employee: Employee): void {
    const cash = this.cash$.get();

    if (cash < employee.price) {
      return;
    }

    const newCash = cash - employee.price;
    this.cash$.set(newCash);
    this.employees$.set(employee.key, employee);
    this.$service.setCash(newCash);
    this.$service.addEmployee(employee.key);
  }

  @action
  public removeEmployee(employeeKey: EmployeeKey): void {
    this.employees$.delete(employeeKey);
    this.$service.removeEmployee(employeeKey);
  }
}
