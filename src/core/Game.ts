import * as Phaser from 'phaser';

import { Inventory } from '../entities/Inventory';
import { MainScene } from './scenes/MainScene';

export const createGame = (canvas: HTMLCanvasElement, inventory: Inventory) =>
  new Phaser.Game({
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
    scene: [new MainScene(inventory)]
  });
