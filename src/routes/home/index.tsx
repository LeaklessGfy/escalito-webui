import { FunctionalComponent, h } from 'preact';
import { Provider } from '../../entities/Provider';

import ShopComponent from '../../components/ShopComponent';

import { Inventory } from '../../entities/Inventory';

const Home: FunctionalComponent = () => {
  const inventory = new Inventory(100, new Map());
  const providers: Provider[] = [Provider.buildSuperMarket()];

  return (
    <main>
      <ShopComponent inventory={inventory} providers={providers} />
    </main>
  );
};

export default Home;
