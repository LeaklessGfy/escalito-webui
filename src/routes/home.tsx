import { observer } from 'mobx-preact';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';

import HireComponent from '../components/Hire/HireComponent';
import MenuComponent from '../components/Menu/MenuComponent';
import ShopComponent from '../components/Shop/ShopComponent';
import LoginComponent from '../components/User/Login';
import { store, storeContext } from '../store';

const Home: FunctionalComponent = () => {
  useEffect(() => {
    store.init();
  }, []);

  return (
    <storeContext.Provider value={store}>
      {store.user ? (
        <main>
          <ShopComponent />
          <MenuComponent />
          <HireComponent />
        </main>
      ) : (
        <main>
          <LoginComponent />
        </main>
      )}

      <p class="text-center text-gray-500 text-xs">
        &copy;2020 Escalito. All rights reserved.
      </p>
    </storeContext.Provider>
  );
};

export default observer(Home);
