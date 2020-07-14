import * as Phaser from 'phaser';

import { Store } from '../store';
import { IScene } from './scenes/IScene';
import { MainScene } from './scenes/MainScene';

export function createGame(
  canvas: HTMLCanvasElement,
  store: Store
): Promise<IScene> {
  return new Promise(resolve => {
    const scene = new MainScene(store);
    const game = new Phaser.Game({
      type: Phaser.WEBGL,
      canvas: canvas,
      width: 1000,
      height: 300,
      title: 'Escale',
      version: '1.0',
      render: {
        pixelArt: true
      },
      scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: { y: window.innerHeight / 2 }
        }
      },
      scene: [scene]
    });

    game.events.on('ready', () => {
      scene.scene.pause();
      resolve(scene);
    });
  });
}
