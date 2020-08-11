import { IEmitter } from '../../entities/game/IEmitter';
import { IPoint } from '../../entities/game/IPoint';
import { IScene } from '../../entities/game/IScene';
import { Ingredient } from '../../entities/static/Ingredient';
import { BarController } from '../controllers/BarController';

export class LiquidEmitter implements IEmitter {
  private readonly _barCtr: BarController;
  private readonly _emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private _emitting: boolean = false;

  public constructor(
    barCtr: BarController,
    emitter: Phaser.GameObjects.Particles.ParticleEmitter
  ) {
    this._barCtr = barCtr;
    this._emitter = emitter;
  }

  public start(ingredient: Ingredient, point: IPoint): void {
    this._emitting = true;
    this._emitter.setTint(ingredient.color);
    this._emitter.setPosition(point.x, point.y);
    this._emitter.start();
  }

  public stop(): void {
    this._emitting = false;
    this._emitter.stop();
  }

  public checkCollision(scene: IScene, ingredient: Ingredient): void {
    const glass = this._barCtr.glass;

    if (glass === undefined) {
      return;
    }

    this._emitter.forEachAlive(p => {
      if (glass.body.hitTest(p.x, p.y)) {
        p.lifeCurrent = 0;
        glass.addIngredient(ingredient);
      }
    }, scene);
  }

  public isEmitting(): boolean {
    return this._emitting;
  }
}
