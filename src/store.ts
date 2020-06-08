import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { Cocktails } from './entities/Cocktail';
import { Inventory } from './entities/Inventory';
import { Providers } from './entities/Provider';
import { globalService } from './remote/service';

export const store = {
  init: async function() {
    const inventory = await globalService.getInventory();
    this.inventory = inventory;
  },
  inventory: new Inventory(100),
  providers: Providers,
  cocktails: Cocktails
};

export const storeContext = createContext(store);

export const useStore = () => useContext(storeContext);
