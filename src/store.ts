import { observable } from 'mobx';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { Cocktail, CocktailKey, Cocktails } from './entities/Cocktail';
import { Inventory } from './entities/Inventory';
import { Provider, ProviderKey, Providers } from './entities/Provider';
import { Service } from './remote/service';

export class Store {
  @observable
  private _inventory: Inventory;

  private readonly _providers: Map<ProviderKey, Provider>;
  private readonly _cocktails: Map<CocktailKey, Cocktail>;

  private readonly $service: Service;

  constructor() {
    this._inventory = new Inventory(0);
    this._providers = Providers;
    this._cocktails = Cocktails;
    this.$service = new Service();
  }

  public async init() {
    const inventory = await this.$service.getInventory();
    this._inventory = inventory;
  }

  public get inventory() {
    return this._inventory;
  }

  public get providers() {
    return this._providers;
  }

  public get cocktails() {
    return this._cocktails;
  }
}

export const storeContext = createContext(new Store());
export const useStore = () => useContext(storeContext);
