import { observer } from 'mobx-react-lite';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import { createGame } from '../../core/Game';
import { useStore } from '../../store';

const GameComponent: FunctionalComponent = () => {
  const store = useStore();
  const ref = useRef<HTMLCanvasElement>();

  useEffect(() => {
    if (ref.current && store.ready) {
      createGame(ref.current, store);
    }
  }, [ref, store]);

  return <canvas ref={ref} />;
};

export default observer(GameComponent);
