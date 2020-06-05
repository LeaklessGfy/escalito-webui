import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { Inventory } from './entities/Inventory';
import { Provider } from './entities/Provider';

export const store = {
  inventory: new Inventory(100, new Map()),
  providers: [Provider.buildSuperMarket()]
};

export const storeContext = createContext(store);

export const useStore = () => useContext(storeContext);
