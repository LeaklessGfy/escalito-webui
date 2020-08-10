import { computed, observable } from 'mobx';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { Inventory } from './entities/Inventory';
import { UserDto } from './entities/dto/UserDTO';
import { Cocktail, CocktailKey } from './entities/static/Cocktail';
import { Employee, EmployeeKey } from './entities/static/Employee';
import { Ingredient, IngredientKey } from './entities/static/Ingredient';
import { Provider, ProviderKey } from './entities/static/Provider';
import { Cocktails } from './entities/values/Cocktails';
import { Employees } from './entities/values/Employees';
import { Ingredients } from './entities/values/Ingredients';
import { Providers } from './entities/values/Providers';
import { Service } from './remote/Service';

export class Store {
  @observable
  public ready: boolean;

  @observable
  public user: UserDto;

  @observable
  public inventory?: Inventory;

  public readonly service: Service;
  public readonly ingredients: Map<IngredientKey, Ingredient>;
  public readonly providers: Map<ProviderKey, Provider>;
  public readonly cocktails: Map<CocktailKey, Cocktail>;
  public readonly employees: Map<EmployeeKey, Employee>;

  constructor() {
    this.ready = false;
    this.user = null;

    this.service = new Service();
    this.ingredients = Ingredients();
    this.providers = Providers();
    this.cocktails = Cocktails();
    this.employees = Employees();

    this.service.subscribe(this.init.bind(this));
  }

  @computed
  public get ingredientsArray() {
    return Array.from(this.ingredients.values());
  }

  @computed
  public get providersArray() {
    return Array.from(this.providers.values());
  }

  @computed
  public get cocktailsArray() {
    return Array.from(this.cocktails.values());
  }

  @computed
  public get employeesArray(): Employee[] {
    return Array.from(this.employees.values());
  }

  private async init(user: UserDto) {
    if (!this.ready) {
      this.ready = true;
    }
    this.user = user;
    if (user) {
      this.inventory = await this.service.getInventory();
    }
  }
}

export const store = new Store();
export const storeContext = createContext(store);
export const useStore = () => useContext(storeContext);
