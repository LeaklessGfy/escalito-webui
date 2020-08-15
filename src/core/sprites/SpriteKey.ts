import { IPoint } from '../../entities/game/IPoint';
import { IScene } from '../../entities/game/IScene';
import { AnimKey } from './AnimKey';

export enum SpriteKey {
  // Decoration
  Bar = 'decorations/bar',
  BarTop = 'decorations/bar_top',
  Door = 'decorations/door',
  Window = 'decorations/window',
  Jukebox = 'decorations/jukebox',
  WallPaper = 'decorations/wall_paper',
  Wood = 'decorations/wood',
  Square = 'decorations/square',

  // Characters
  Barmaid = 'characters/barmaid',
  BodyGuard = 'characters/body_guard',
  ClientDefault = 'characters/client.default',
  Sponsor = 'characters/sponsor',

  // Ingredients
  BottleRum = 'ingredients/bottle.rum',
  BottleCola = 'ingredients/bottle.cola',
  BottleLemonade = 'ingredients/bottle.lemonade',

  // Glass
  GlassDefault = 'glass/default',
  GlassDefaultMask = 'glass/default.mask'
}

export function toPath(key: SpriteKey): string {
  return `assets/sprites/${key}.png`;
}

export function toAtlas(key: SpriteKey) {
  return {
    atlas: `assets/sprites/${key}.atlas.json`,
    folder: `assets/sprites/${key.split('/')[0]}`
  };
}

export function toAnimPath(key: SpriteKey, anim: AnimKey): string {
  return `assets/sprites/${key}.${anim}.png`;
}

export function toSpriteSheet(key: SpriteKey, anim: AnimKey, dim: IPoint) {
  return {
    key: key + '.' + anim,
    path: toAnimPath(key, anim),
    dim: {
      frameWidth: dim.x,
      frameHeight: dim.y
    }
  };
}

export function toAnim(
  scene: IScene,
  key: SpriteKey,
  anim: AnimKey,
  length: number,
  frameRate: number,
  yoyo: boolean
) {
  return {
    key: key + '.' + anim,
    frames: scene.anims.generateFrameNumbers(key + '.' + anim, {
      start: 0,
      end: length
    }),
    frameRate,
    repeat: -1,
    yoyo
  };
}
