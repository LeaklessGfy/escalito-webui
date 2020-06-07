import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { Inventory } from './entities/Inventory';
import { Provider } from './entities/Provider';
import { CocktailExtended } from './entities/Cocktail';
import { globalService } from './remote/service';

export const store = {
  init: async function() {
    const inventory = await globalService.getInventory();
    this.inventory = inventory;
  },
  inventory: new Inventory(100),
  providers: [Provider.buildSuperMarket()],
  cocktails: [CocktailExtended.buildMojito(), CocktailExtended.buildCubaLibre()]
};

export const storeContext = createContext(store);

export const useStore = () => useContext(storeContext);
