import { Ingredient } from '../../entities/static/Ingredient';
import { Store } from '../../store';
import {
  GameIngredient,
  buildGameIngredient
} from '../cocktails/GameIngredient';
import { Glass } from '../cocktails/Glass';
import { IScene } from '../scenes/IScene';
import { SpriteKey } from '../sprites/SpriteKey';
import { IController } from './IController';
import { SelectController } from './SelectControllers';

export class BarController implements IController {
  public static readonly KEY: Symbol = Symbol();

  private readonly _ingredients: GameIngredient[] = [];

  private _door?: Phaser.GameObjects.Image;
  private _glass?: Glass;
  private _emitter?: Phaser.GameObjects.Particles.ParticleEmitter & {
    source?: Ingredient;
  };

  public open: boolean = true;

  /** Interface **/
  public preload(scene: IScene): void {
    scene.load.image(SpriteKey.Bar, 'assets/bar.png');
    scene.load.image(SpriteKey.BarTop, 'assets/bar.top.png');
    scene.load.image(SpriteKey.RumBottle, 'assets/bottle.rum.png');
    scene.load.image(SpriteKey.DefaultGlass, 'assets/glass.default.png');
    scene.load.image(SpriteKey.Square, 'assets/square.png');
    scene.load.multiatlas(SpriteKey.Door, 'assets/door.atlas.json', 'assets');
  }

  public create(scene: IScene): void {
    const { x, y } = scene.settings.barPosition;
    const xDoor = scene.settings.spawnPosition.x;

    const spriteBar = scene.add.sprite(x, y, SpriteKey.Bar);
    spriteBar
      .setY(y - 10)
      .setScale(0.8)
      .setDepth(1)
      .setName('Bar');

    const spriteBarTop = scene.add.sprite(x, y, SpriteKey.BarTop);
    spriteBarTop.setY(y - 80).setScale(0.8);

    this._door = scene.add.image(xDoor, y, SpriteKey.Door, 'open.png');
    this._door
      .setY(y + 10 - this._door.frame.height / 2)
      .setInteractive()
      .on('pointerdown', () => {
        this.open = !this.open;
      })
      .setName('Door');

    scene.add.rectangle(
      scene.settings.middleWidth,
      scene.settings.middleHeight,
      scene.settings.width,
      5,
      0xffffff,
      1
    );

    this._glass = Glass.buildDefault(scene);

    const config = {
      x: scene.settings.middleWidth,
      y: 10,
      active: true,
      on: false,
      gravityY: scene.settings.height,
      deathZone: {
        type: 'onEnter',
        source: {
          contains: (x: number, y: number) => {
            if (
              this._emitter?.source === undefined ||
              this._glass === undefined
            ) {
              return false;
            }

            const hit = this._glass.body.hitTest(x, y);
            if (hit) {
              this._glass.addIngredient(this._emitter.source);
            }
            return hit;
          }
        }
      }
    };

    const particle = scene.add.particles(SpriteKey.Square);
    this._emitter = particle.createEmitter(config);

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, this._door);
    selectCtr.addSelect(scene, spriteBar);
  }

  public update(scene: IScene, delta: number): void {
    for (const ingredient of this._ingredients) {
      ingredient.update(scene);
    }

    if (
      this._door !== undefined &&
      this.open &&
      this._door.frame.name !== 'open.png'
    ) {
      this._door.setFrame('open.png');
    }

    if (
      this._door !== undefined &&
      !this.open &&
      this._door.frame.name !== 'close.png'
    ) {
      this._door.setFrame('close.png');
    }
  }

  public daily(scene: IScene, store: Store, day: number): void {
    for (const ingredient of store.inventory.ingredients) {
      this._ingredients.push(
        buildGameIngredient(scene, ingredient, this._emitter as any)
      );
    }
  }

  /** Custom **/
  public get glass() {
    return this._glass;
  }
}
