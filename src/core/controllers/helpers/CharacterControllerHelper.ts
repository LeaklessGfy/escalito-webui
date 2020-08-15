import { IScene } from '../../../entities/game/IScene';
import { AnimKey } from '../../sprites/AnimKey';
import { SpriteKey, toAnim, toSpriteSheet } from '../../sprites/SpriteKey';

export class CharacterControllerHelper {
  public static preload(scene: IScene) {
    this.loadSprite(scene, SpriteKey.Barmaid, AnimKey.Idle, 19, 34);
    this.loadSprite(scene, SpriteKey.Barmaid, AnimKey.Move, 21, 33);

    this.loadSprite(scene, SpriteKey.ClientDefault, AnimKey.Idle, 32, 28);
    this.loadSprite(scene, SpriteKey.ClientDefault, AnimKey.Move, 32, 32);

    this.loadSprite(scene, SpriteKey.BodyGuard, AnimKey.Idle, 20, 32);
    this.loadSprite(scene, SpriteKey.Sponsor, AnimKey.Idle, 33, 43);
    this.loadSprite(scene, SpriteKey.Sponsor, AnimKey.Move, 29, 42);
  }

  public static create(scene: IScene) {
    this.loadAnim(scene, SpriteKey.Barmaid, AnimKey.Idle, 11, 10);
    this.loadAnim(scene, SpriteKey.Barmaid, AnimKey.Move, 11, 10);

    this.loadAnim(scene, SpriteKey.ClientDefault, AnimKey.Idle, 7, 5);
    this.loadAnim(scene, SpriteKey.ClientDefault, AnimKey.Move, 7, 7);

    this.loadAnim(scene, SpriteKey.BodyGuard, AnimKey.Idle, 3, 1);
    this.loadAnim(scene, SpriteKey.Sponsor, AnimKey.Idle, 12, 5, true);
    this.loadAnim(scene, SpriteKey.Sponsor, AnimKey.Move, 12, 5);
  }

  private static loadSprite(
    scene: IScene,
    key: SpriteKey,
    anim: AnimKey,
    width: number,
    height: number
  ) {
    const spriteSheet = toSpriteSheet(key, anim, { x: width, y: height });
    scene.load.spritesheet(spriteSheet.key, spriteSheet.path, spriteSheet.dim);
  }

  private static loadAnim(
    scene: IScene,
    key: SpriteKey,
    anim: AnimKey,
    length: number,
    frameRate: number,
    yoyo: boolean = false
  ) {
    scene.anims.create(toAnim(scene, key, anim, length, frameRate, yoyo));
  }
}
