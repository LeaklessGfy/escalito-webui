import * as Phaser from 'phaser';

import { Inventory } from '../entities/Inventory';
import { IScene } from '../entities/game/IScene';
import { InventoryProxy } from './InventoryProxy';
import { MainScene } from './scenes/MainScene';

export function createGame(
  canvas: HTMLCanvasElement,
  inventory: Inventory
): Promise<IScene> {
  return new Promise(resolve => {
    const proxy = new InventoryProxy(inventory);
    proxy.watch();

    const scene = new MainScene(proxy);
    const game = new Phaser.Game({
      type: Phaser.WEBGL,
      canvas: canvas,
      width: canvas.parentElement?.clientWidth,
      height: 300,
      title: 'Escale',
      version: '1.0',
      render: {
        pixelArt: true
      },
      scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.NONE
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
