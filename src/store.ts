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
  private _inventory: Inventory;
  private readonly $service: Service;

  public readonly providers: Map<ProviderKey, Provider>;
  public readonly cocktails: Map<CocktailKey, Cocktail>;
  public readonly employees: Map<EmployeeKey, Employee>;

  constructor() {
    this._inventory = new Inventory(0);
    this.providers = Providers;
    this.cocktails = Cocktails;
    this.employees = Employees;
    this.$service = new Service();
  }

  public async init() {
    this._inventory = await this.$service.getInventory();
    this._inventory.attachService(this.$service);
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

export const storeContext = createContext(new Store());
export const useStore = () => useContext(storeContext);
