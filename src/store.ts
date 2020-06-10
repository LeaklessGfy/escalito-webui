import { observable } from 'mobx';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { Cocktail, CocktailKey, Cocktails } from './entities/Cocktail';
import { Employee, EmployeeKey, Employees } from './entities/Employee';
import { Inventory } from './entities/Inventory';
import { Provider, ProviderKey, Providers } from './entities/Provider';
import { Service } from './remote/service';

export class Store {
  @observable
  private _user: firebase.UserInfo | null;

  @observable
  private _inventory: Inventory;

  public readonly service: Service;
  public readonly providers: Map<ProviderKey, Provider>;
  public readonly cocktails: Map<CocktailKey, Cocktail>;
  public readonly employees: Map<EmployeeKey, Employee>;

  constructor() {
    this.service = new Service();
    this._inventory = new Inventory(0);
    this._user = null;

    this.providers = Providers;
    this.cocktails = Cocktails;
    this.employees = Employees;
  }

  public async init() {
    this.service.addAuthListener(async user => {
      this._user = user;
      if (user) {
        this._inventory = await this.service.getInventory();
      }
    });
  }

  public get user() {
    return this._user;
  }

  public get inventory() {
    return this._inventory;
  }

  public get providersArray() {
    return Array.from(this.providers.values());
  }

  public get cocktailsArray() {
    return Array.from(this.cocktails.values());
  }

  public get employeesArray(): Employee[] {
    return Array.from(this.employees.values());
  }
}

export const store = new Store();
export const storeContext = createContext(store);
export const useStore = () => useContext(storeContext);
