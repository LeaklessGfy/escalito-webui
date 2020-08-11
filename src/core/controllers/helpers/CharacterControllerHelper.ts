import { IScene } from '../../../entities/game/IScene';
import { AnimKey } from '../../sprites/AnimKey';
import { SpriteKey } from '../../sprites/SpriteKey';

export class CharacterControllerHelper {
  public static preload(scene: IScene) {
    scene.load.spritesheet(
      SpriteKey.Barmaid + '.' + AnimKey.Idle,
      'assets/barmaid.idle.png',
      {
        frameWidth: 19,
        frameHeight: 34
      }
    );
    scene.load.spritesheet(
      SpriteKey.Barmaid + '.' + AnimKey.Move,
      'assets/barmaid.move.png',
      {
        frameWidth: 21,
        frameHeight: 33
      }
    );
    scene.load.spritesheet(
      SpriteKey.DefaultClient + '.' + AnimKey.Idle,
      'assets/client1.idle.png',
      {
        frameWidth: 32,
        frameHeight: 28
      }
    );
    scene.load.spritesheet(
      SpriteKey.DefaultClient + '.' + AnimKey.Move,
      'assets/client1.move.png',
      {
        frameWidth: 32,
        frameHeight: 32
      }
    );
  }

  public static create(scene: IScene) {
    scene.anims.create({
      key: SpriteKey.Barmaid + '.' + AnimKey.Idle,
      frames: scene.anims.generateFrameNumbers(
        SpriteKey.Barmaid + '.' + AnimKey.Idle,
        {
          start: 0,
          end: 11
        }
      ),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: SpriteKey.Barmaid + '.' + AnimKey.Move,
      frames: scene.anims.generateFrameNumbers(
        SpriteKey.Barmaid + '.' + AnimKey.Move,
        {
          start: 0,
          end: 11
        }
      ),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: SpriteKey.DefaultClient + '.' + AnimKey.Idle,
      frames: scene.anims.generateFrameNumbers(
        SpriteKey.DefaultClient + '.' + AnimKey.Idle,
        {
          start: 0,
          end: 7
        }
      ),
      frameRate: 5,
      repeat: -1
    });
    scene.anims.create({
      key: SpriteKey.DefaultClient + '.' + AnimKey.Move,
      frames: scene.anims.generateFrameNumbers(
        SpriteKey.DefaultClient + '.' + AnimKey.Move,
        {
          start: 0,
          end: 7
        }
      ),
      frameRate: 7,
      repeat: -1
    });
  }
}
