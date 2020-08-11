import { IScene } from '../../../entities/game/IScene';
import { SpriteKey } from '../../sprites/SpriteKey';

export class BarControllerHelper {
  public static preload(scene: IScene) {
    scene.load.image(SpriteKey.Wall, 'assets/wall_paper.png');
    scene.load.image(SpriteKey.Wood, 'assets/wood.png');

    scene.load.image(SpriteKey.Bar, 'assets/bar.png');
    scene.load.image(SpriteKey.BarTop, 'assets/bar_top.png');
    scene.load.multiatlas(SpriteKey.Door, 'assets/door.atlas.json', 'assets');
    scene.load.image(SpriteKey.Window, 'assets/window.png');
    scene.load.image(SpriteKey.Jukebox, 'assets/jukebox.png');
    scene.load.image(SpriteKey.Square, 'assets/square.png');

    scene.load.image(SpriteKey.GlassDefault, 'assets/glass.default.png');
    scene.load.image(
      SpriteKey.GlassDefaultMask,
      'assets/glass.default.mask.png'
    );
  }

  public static create(scene: IScene) {
    const dim = scene.settings.dimension;
    const mid = scene.settings.middleDimension;
    const spawn = scene.settings.spawn;
    const floorHeight = scene.settings.floorHeight;

    const spriteWall = scene.add.tileSprite(
      mid.x,
      mid.y,
      dim.x,
      300,
      SpriteKey.Wall
    );
    spriteWall.setY(mid.y + spriteWall.displayHeight / 2);

    const spriteWood = scene.add.tileSprite(
      mid.x,
      dim.y,
      dim.x,
      48,
      SpriteKey.Wood
    );
    spriteWood.setY(dim.y - spriteWood.displayHeight / 2 - floorHeight);

    const spriteBar = scene.add.sprite(mid.x, dim.y, SpriteKey.Bar);
    spriteBar
      .setScale(0.8)
      .setY(dim.y - spriteBar.displayHeight / 2 - floorHeight)
      .setDepth(1)
      .setName('Bar');

    const spriteBarTop = scene.add.sprite(mid.x, dim.y, SpriteKey.BarTop);
    spriteBarTop
      .setScale(0.8)
      .setY(spriteBar.y - spriteBar.displayHeight * 1.7);

    const spriteDoor = scene.add.image(
      spawn.x,
      spawn.y,
      SpriteKey.Door,
      'open.png'
    );
    spriteDoor
      .setY(spawn.y - spriteDoor.frame.height / 2)
      .setInteractive()
      .setName('Door');

    const spriteWindow = scene.add.image(
      spawn.x + mid.x / 2.5,
      spawn.y - spriteDoor.displayHeight / 1.2,
      SpriteKey.Window
    );

    const spriteJukebox = scene.add.image(
      mid.x + mid.x / 2,
      spawn.y,
      SpriteKey.Jukebox
    );
    spriteJukebox
      .setY(spawn.y - spriteJukebox.displayHeight / 2)
      .setInteractive()
      .setName('Jukebox');

    const block = scene.add.rectangle(mid.x, mid.y, dim.x, 5, 0xffffff, 1);
    scene.add.rectangle(
      mid.x,
      dim.y - floorHeight / 2,
      dim.x,
      floorHeight,
      0x000000,
      1
    );

    scene.physics.add.existing(block);
    (block.body as Phaser.Physics.Arcade.Body)
      .setImmovable(true)
      .setAllowGravity(false);

    return {
      spriteWall,
      spriteWood,
      spriteBar,
      spriteBarTop,
      spriteDoor,
      spriteWindow,
      spriteJukebox,
      block
    };
  }
}
