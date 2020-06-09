import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';

import HireComponent from '../components/Hire/HireComponent';
import MenuComponent from '../components/Menu/MenuComponent';
import ShopComponent from '../components/Shop/ShopComponent';
import { Store, storeContext } from '../store';

const Home: FunctionalComponent = () => {
  const store = new Store();

  useEffect(() => {
    store.init();
  }, []);

  return (
    <main>
      <storeContext.Provider value={store}>
        <ShopComponent />
        <MenuComponent />
        <HireComponent />
      </storeContext.Provider>
    </main>
  );
};

export default Home;
