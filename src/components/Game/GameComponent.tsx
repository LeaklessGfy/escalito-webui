import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import { createGame } from '../../core/Game';

const GameComponent: FunctionalComponent = () => {
  const ref = useRef<HTMLCanvasElement>();

  useEffect(() => {
    if (ref.current) {
      createGame(ref.current);
    }
  }, [ref]);

  return <canvas ref={ref} width="100wh" height="200px" />;
};

export default GameComponent;
