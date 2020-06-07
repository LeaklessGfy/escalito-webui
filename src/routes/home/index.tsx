import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';

import ShopComponent from '../../components/ShopComponent';
import MenuComponent from '../../components/MenuComponent';

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
