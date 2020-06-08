import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';

import MenuComponent from '../../components/MenuComponent';
import ShopComponent from '../../components/ShopComponent';
import { Store, storeContext } from '../../store';

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
      </storeContext.Provider>
    </main>
  );
};

export default Home;
