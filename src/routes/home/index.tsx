import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';

import MenuComponent from '../../components/MenuComponent';
import ShopComponent from '../../components/ShopComponent';

const Home: FunctionalComponent = () => {
  useEffect(() => {
    // init store
  }, []);

  return (
    <main>
      <ShopComponent />
      <MenuComponent />
    </main>
  );
};

export default Home;
