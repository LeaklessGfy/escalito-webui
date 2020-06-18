import { GameObjects, Scene } from 'phaser';

import { Settings } from '../Settings';

export default class Bar {
  static build(scene: Scene, settings: Settings): GameObjects.Rectangle {
    return scene.add
      .rectangle(
        settings.middle,
        settings.floor,
        settings.barWidth,
        settings.barHeight,
        settings.barColor
      )
      .setOrigin(0, 1);
  }
}
