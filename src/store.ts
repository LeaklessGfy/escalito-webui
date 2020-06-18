import { computed, observable } from 'mobx';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { IUserDTO } from './dto/UserDTO';
import { Cocktail, CocktailKey, Cocktails } from './entities/Cocktail';
import { Employee, EmployeeKey, Employees } from './entities/Employee';
import { Inventory } from './entities/Inventory';
import { Provider, ProviderKey, Providers } from './entities/Provider';
import { Service } from './remote/Service';

export class Store {
  @observable
  public ready: boolean;

  @observable
  public user: IUserDTO;

  @observable
  public inventory: Inventory;

  public readonly service: Service;
  public readonly providers: Map<ProviderKey, Provider>;
  public readonly cocktails: Map<CocktailKey, Cocktail>;
  public readonly employees: Map<EmployeeKey, Employee>;

  constructor() {
    this.ready = false;
    this.user = null;
    this.inventory = new Inventory(0);

    this.service = new Service();
    this.providers = Providers;
    this.cocktails = Cocktails;
    this.employees = Employees;

    this.service.subscribe(async user => {
      if (!this.ready) {
        this.ready = true;
      }
      this.user = user;
      if (user) {
        this.inventory = await this.service.getInventory();
      }
    });
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
}

export const store = new Store();
export const storeContext = createContext(store);
export const useStore = () => useContext(storeContext);
