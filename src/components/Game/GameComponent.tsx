import { observer } from 'mobx-react-lite';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import { createGame } from '../../core/Game';
import { IScene } from '../../entities/game/IScene';
import { useStore } from '../../store';

const GameComponent: FunctionalComponent = () => {
  const { inventory } = useStore();
  const ref = useRef<HTMLCanvasElement>();
  const [scene, setScene] = useState<IScene | undefined>(undefined);
  const [started, setStarted] = useState(false);

  const startScene = () => {
    if (scene) {
      scene.start();
      setStarted(true);
    }
  };

  useEffect(() => {
    if (ref.current && inventory !== undefined) {
      createGame(ref.current, inventory).then(scene => setScene(scene));
    }
  }, [ref, inventory]);

  return (
    <section class="text-center">
      <button
        class="btn bg-green-500 mb-3"
        disabled={scene === undefined || started === true}
        onClick={startScene}
      >
        Start
      </button>

      <canvas ref={ref} />
    </section>
  );
};

export default observer(GameComponent);
