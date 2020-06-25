import { action, observable } from 'mobx';

import { IInventoryDTO } from '../dto/InventoryDTO';
import { Service } from '../remote/Service';
import { Cocktail, CocktailExtended, CocktailKey } from './Cocktail';
import { Employee, EmployeeKey } from './Employee';
import { IngredientExtended, IngredientKey } from './Ingredient';
import { Provider, ProviderKey } from './Provider';

export class Inventory {
  @observable
  private _cash: number;

  @observable
  private readonly _ingredients: Map<
    IngredientKey,
    Map<ProviderKey, IngredientExtended>
  >;

  @observable
  private readonly _cocktails: Map<CocktailKey, CocktailExtended>;

  @observable
  private readonly _employees: Set<EmployeeKey>;

  private $service?: Service;

  constructor(
    cash: number,
    ingredients: Map<
      IngredientKey,
      Map<ProviderKey, IngredientExtended>
    > = new Map(),
    cocktails: Map<CocktailKey, CocktailExtended> = new Map(),
    employees: Set<EmployeeKey> = new Set()
  ) {
    this._cash = cash;
    this._ingredients = ingredients;
    this._cocktails = cocktails;
    this._employees = employees;
  }

  public get cash(): number {
    return this._cash;
  }

  public get cocktails(): CocktailExtended[] {
    return Array.from(this._cocktails.values());
  }

  public get ingredients(): IngredientExtended[] {
    const allValues: IngredientExtended[] = [];
    for (const providers of this._ingredients.values()) {
      for (const ingredient of providers.values()) {
        allValues.push(ingredient);
      }
    }
    return allValues;
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
      this._ingredients.get(ingredientKey) ??
      new Map<ProviderKey, IngredientExtended>();
    const ingredientExtended = providers.get(providerKey);

    if (ingredientExtended === undefined) {
      // should create it or get it directly from arguments
      throw new Error('');
    }

    ingredientExtended.stock++;
    providers.set(providerKey, ingredientExtended);

    this._ingredients.set(ingredientKey, providers);
    this.$service?.addIngredient(
      ingredientKey,
      providerKey,
      ingredientExtended.stock
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

    if (ingredientExtended.stock > 1) {
      ingredientExtended.stock--;
      providers.set(providerKey, ingredientExtended);
    } else {
      providers.delete(providerKey);
    }

    if (providers.size > 0) {
      this._ingredients.set(ingredientKey, providers);
    } else {
      this._ingredients.delete(ingredientKey);
    }

    this.$service?.removeIngredient(
      ingredientKey,
      providerKey,
      ingredientExtended.stock
    );
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
    this._employees.add(employee.key);
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

  public static fromDTO(dto: IInventoryDTO): Inventory {
    const ingredients = new Map<
      IngredientKey,
      Map<ProviderKey, IngredientExtended>
    >();

    for (const ingredientDto of dto.ingredients) {
      const ingredientKey = ingredientDto.ingredient;
      const providerKey = ingredientDto.provider;
      const stock = ingredientDto.stock;

      const providers =
        ingredients.get(ingredientKey) ??
        new Map<ProviderKey, IngredientExtended>();

      if (providers.has(providerKey)) {
        throw new Error('Duplicate entry in providers ' + providerKey);
      }

      const ingredientExtended = Provider.buildIngredient(
        ingredientKey,
        providerKey,
        stock
      );

      providers.set(providerKey, ingredientExtended);
      ingredients.set(ingredientKey, providers);
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

    const employees = new Set<EmployeeKey>();
    for (const employee of dto.employees) {
      employees.add(employee);
    }

    return new Inventory(dto.cash, ingredients, cocktails, employees);
  }
}
