import * as Phaser from 'phaser';

import { MainScene } from './scenes/MainScene';

export const createGame = (canvas: HTMLCanvasElement) =>
  new Phaser.Game({
    type: Phaser.CANVAS,
    canvas: canvas,
    width: 1000,
    height: 300,
    title: 'Escale',
    version: '1.0',
    render: {
      pixelArt: true
    },
    scale: {
      // mode: Phaser.Scale.FIT,
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
    scene: [MainScene]
  });
