import { observer } from 'mobx-react-lite';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import { useStore } from '../../store';
import EmployeeComponent from '../Employee/EmployeeComponent';
import GameComponent from '../Game/GameComponent';
import MenuComponent from '../Menu/MenuComponent';
import ShopComponent from '../Shop/ShopComponent';

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
