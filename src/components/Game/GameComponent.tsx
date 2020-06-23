import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import { createGame } from '../../core/Game';
import { useStore } from '../../store';

const GameComponent: FunctionalComponent = () => {
  const { ready, inventory } = useStore();
  const ref = useRef<HTMLCanvasElement>();

  useEffect(() => {
    if (ref.current && ready) {
      createGame(ref.current, inventory);
    }
  }, [ref, ready]);

  return <canvas ref={ref} />;
};

export default GameComponent;
