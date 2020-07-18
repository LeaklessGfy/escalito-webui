import { Ingredient, IngredientKey } from '../../entities/static/Ingredient';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { SpriteKey } from '../sprites/SpriteKey';

interface IngredientInfo {
  ingredient: Ingredient;
  stock: number;
}

export class Glass {
  private readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _mask: Phaser.GameObjects.Sprite;
  private readonly _graphics: Phaser.GameObjects.Graphics;
  private readonly _recipe: Map<IngredientKey, IngredientInfo>;

  constructor(
    sprite: Phaser.GameObjects.Sprite,
    mask: Phaser.GameObjects.Sprite,
    graphics: Phaser.GameObjects.Graphics
  ) {
    this._sprite = sprite;
    this._mask = mask;
    this._graphics = graphics;
    this._recipe = new Map();

    this._sprite.on('drag', (p: any, x: number, y: number) => {
      this._sprite.x = x;
      this._sprite.y = y;
      this._mask.x = x;
      this._mask.y = y;
      this.updateGraphics();
    });
  }

  public get sprite(): Phaser.GameObjects.Sprite {
    return this._sprite;
  }

  public get body(): Phaser.Physics.Arcade.Body {
    return this._sprite.body as Phaser.Physics.Arcade.Body;
  }

  public get recipe(): Map<IngredientKey, number> {
    const map = new Map<IngredientKey, number>();
    for (const [key, info] of this._recipe) {
      map.set(key, info.stock);
    }
    return map;
  }

  public addIngredient(ingredient: Ingredient): void {
    const base = this._recipe.get(ingredient.key) ?? {
      ingredient,
      stock: 0
    };
    base.stock += ingredient.amount;
    this._recipe.set(ingredient.key, base);
    this.updateGraphics();
  }

  private updateGraphics() {
    this._graphics.clear();
    const { x, y } = this._sprite;
    const bottomX = x - this._sprite.displayWidth / 2;
    const bottomY = y + this._sprite.displayHeight / 2;

    let lastY = bottomY;
    for (const [_, info] of this._recipe.entries()) {
      const width = this._sprite.displayWidth;
      const height = info.stock / 2;

      this._graphics.fillStyle(info.ingredient.color, 1);
      this._graphics.fillRect(bottomX, lastY - height, width, height);
      lastY -= height;
    }
  }

  public static buildDefault(scene: IScene): Glass {
    const { x, y } = scene.settings.glassPosition;
    const sprite = scene.physics.add.sprite(x, y, SpriteKey.DefaultGlass);
    sprite
      .setScale(0.5)
      .setY(y - sprite.displayHeight / 2)
      .setInteractive()
      .setName('Glass')
      .setGravity(-1)
      .setDepth(3);

    const body = sprite.body as Phaser.Physics.Arcade.Body;
    body.collideWorldBounds = true;
    body.allowGravity = false;

    const mask = scene.make.sprite({
      x: sprite.x,
      y: sprite.y,
      key: SpriteKey.DefaultGlassMask,
      scale: 0.5,
      add: false
    });

    const spriteMask = new Phaser.Display.Masks.BitmapMask(scene, mask);
    const graphics = scene.add.graphics().setMask(spriteMask);

    scene.input.setDraggable(sprite);

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, sprite);

    return new Glass(sprite, mask, graphics);
  }
}
