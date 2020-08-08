import { observer } from 'mobx-react-lite';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import EmployeeComponent from '../components/Employee/EmployeeComponent';
import GameComponent from '../components/Game/GameComponent';
import MenuComponent from '../components/Menu/MenuComponent';
import ShopComponent from '../components/Shop/ShopComponent';
import { useStore } from '../store';

const Home: FunctionalComponent = () => {
  const { ready, user } = useStore();
  console.log('Render Home');

  if (ready && user === null) {
    route('/login');
    return <div />;
  }

  return (
    <main>
      <ShopComponent />
      <MenuComponent />
      <EmployeeComponent />
      <GameComponent />
    </main>
  );
};

export default observer(Home);
