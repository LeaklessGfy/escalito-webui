import { IScene } from '../../entities/game/IScene';
import { GlassKey } from '../../entities/static/Glass';
import { Glass } from '../cocktails/Glass';
import { SelectController } from '../controllers/SelectController';
import { SpriteKey } from '../sprites/SpriteKey';

export class GlassBuilder {
  private readonly _scene: IScene;

  private _glassKey: GlassKey = GlassKey.Default;
  private _sprite?: Phaser.GameObjects.Sprite;
  private _mask?: Phaser.GameObjects.Sprite;
  private _graphics?: Phaser.GameObjects.Graphics;

  public constructor(scene: IScene) {
    this._scene = scene;
  }

  public get spriteKey(): SpriteKey {
    return this._glassKey === GlassKey.Default
      ? SpriteKey.DefaultGlass
      : SpriteKey.DefaultGlass;
  }

  public get maskSpriteKey(): SpriteKey {
    return this._glassKey === GlassKey.Default
      ? SpriteKey.DefaultGlassMask
      : SpriteKey.DefaultGlassMask;
  }

  public get sprite(): Phaser.GameObjects.Sprite {
    if (this._sprite === undefined) {
      throw new Error('Can not access sprite on un-build builder');
    }
    return this._sprite;
  }

  public get mask(): Phaser.GameObjects.Sprite {
    if (this._mask === undefined) {
      throw new Error('Can not access mask on un-build builder');
    }
    return this._mask;
  }

  public get graphics(): Phaser.GameObjects.Graphics {
    if (this._graphics === undefined) {
      throw new Error('Can not access graphics on un-build builder');
    }
    return this._graphics;
  }

  public setGlassKey(key: GlassKey): GlassBuilder {
    this._glassKey = key;
    return this;
  }

  public build(): Glass {
    this.buildSprite();
    this.buildGraphics();
    return new Glass(this);
  }

  private buildSprite() {
    const { x, y } = this._scene.settings.middleDimension;
    const sprite = this._scene.physics.add.sprite(x, y, this.spriteKey);
    sprite
      .setScale(0.5)
      .setY(y - sprite.displayHeight / 2)
      .setInteractive()
      .setName('Glass')
      .setGravity(0, -1)
      .setDepth(3);

    (sprite.body as Phaser.Physics.Arcade.Body)
      .setCollideWorldBounds(true)
      .setAllowGravity(true);

    this._scene.input.setDraggable(sprite);

    const mask = this._scene.make.sprite({
      x: sprite.x,
      y: sprite.y,
      key: this.maskSpriteKey,
      scale: 0.5,
      add: false
    });

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    this._sprite = sprite;
    this._mask = mask;
  }

  private buildGraphics() {
    const spriteMask = new Phaser.Display.Masks.BitmapMask(
      this._scene,
      this.mask
    );

    this._graphics = this._scene.add.graphics().setMask(spriteMask);
  }
}
