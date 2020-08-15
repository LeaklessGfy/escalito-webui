import { IScene } from '../../entities/game/IScene';
import { GlassKey } from '../../entities/static/Glass';
import { Glass } from '../cocktails/Glass';
import { SelectController } from '../controllers/SelectController';
import { SpriteKey } from '../sprites/SpriteKey';

export class GlassBuilder {
  private readonly _scene: IScene;

  public glassKey: GlassKey = GlassKey.Default;
  public sprite!: Phaser.GameObjects.Sprite;
  public mask!: Phaser.GameObjects.Sprite;
  public graphics!: Phaser.GameObjects.Graphics;

  public constructor(scene: IScene) {
    this._scene = scene;
  }

  public get spriteKey(): SpriteKey {
    return this.glassKey === GlassKey.Default
      ? SpriteKey.GlassDefault
      : SpriteKey.GlassDefault;
  }

  public get maskSpriteKey(): SpriteKey {
    return this.glassKey === GlassKey.Default
      ? SpriteKey.GlassDefaultMask
      : SpriteKey.GlassDefaultMask;
  }

  public setGlassKey(key: GlassKey): GlassBuilder {
    this.glassKey = key;
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

    this.sprite = sprite;
    this.mask = mask;
  }

  private buildGraphics() {
    const spriteMask = new Phaser.Display.Masks.BitmapMask(
      this._scene,
      this.mask
    );

    this.graphics = this._scene.add.graphics().setMask(spriteMask);
  }
}
