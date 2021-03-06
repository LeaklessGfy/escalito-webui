import { IPoint } from '../../entities/game/IPoint';
import { IScene } from '../../entities/game/IScene';
import { Ingredient, IngredientKey } from '../../entities/static/Ingredient';
import { GlassBuilder } from '../builders/GlassBuilder';

interface IngredientInfo {
  ingredient: Ingredient;
  stock: number;
}

export class Glass {
  private readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _mask: Phaser.GameObjects.Sprite;
  private readonly _graphics: Phaser.GameObjects.Graphics;
  private readonly _recipe: Map<IngredientKey, IngredientInfo>;

  public constructor(builder: GlassBuilder) {
    this._sprite = builder.sprite;
    this._mask = builder.mask;
    this._graphics = builder.graphics;
    this._recipe = new Map();

    this._sprite.on('drag', (_: any, x: number, y: number) => {
      this.body.setAllowGravity(false);
      this._sprite.x = x;
      this._sprite.y = y;
      this.updateGraphics();
    });

    this._sprite.on('dragend', () => {
      this.body.setAllowGravity(true);
    });
  }

  private get body(): Phaser.Physics.Arcade.Body {
    return this._sprite.body as Phaser.Physics.Arcade.Body;
  }

  public get recipe(): Map<IngredientKey, number> {
    const map = new Map<IngredientKey, number>();
    for (const [key, info] of this._recipe) {
      map.set(key, info.stock);
    }
    return map;
  }

  public update() {
    const { x, y } = this._mask;
    if (x !== this._sprite.x || y !== this._sprite.y) {
      this.updateGraphics();
    }
  }

  public addIngredient(ingredient: Ingredient): void {
    const base = this._recipe.get(ingredient.key) ?? {
      ingredient,
      stock: 0
    };
    base.stock += 1;
    this._recipe.set(ingredient.key, base);
    this.updateGraphics();
  }

  public addCollider(
    scene: IScene,
    go: Phaser.GameObjects.GameObject,
    destroy: boolean,
    callback: ((g: Glass) => void) | undefined = undefined
  ) {
    const collider = scene.physics.add.collider(this._sprite, go, () => {
      callback?.(this);
      destroy && collider.destroy();
    });
  }

  public hasHit(point: IPoint) {
    return this.body.hitTest(point.x, point.y);
  }

  public destroy(): void {
    this._sprite.destroy();
    this._mask.destroy();
    this._graphics.destroy();
  }

  private updateGraphics() {
    this._graphics.clear();
    const { x, y } = this._sprite;
    const bottomX = x - this._sprite.displayWidth / 2;
    const bottomY = y + this._sprite.displayHeight / 2;
    this._mask.setPosition(x, y);

    let lastY = bottomY;
    for (const [_, info] of this._recipe.entries()) {
      const width = this._sprite.displayWidth;
      const height = info.stock / 2;

      this._graphics.fillStyle(info.ingredient.color, 1);
      this._graphics.fillRect(bottomX, lastY - height, width, height);
      lastY -= height;
    }
  }
}
