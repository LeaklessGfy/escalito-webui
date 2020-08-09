import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { BarController } from '../controllers/BarController';
import { IScene } from '../scenes/IScene';
import { Point } from '../sprites/Point';
import { IEmitter } from './IEmitter';

export class LiquidEmitter implements IEmitter {
  private readonly _barCtr: BarController;
  private readonly _emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private _emitting: boolean = false;

  constructor(
    barCtr: BarController,
    emitter: Phaser.GameObjects.Particles.ParticleEmitter
  ) {
    this._barCtr = barCtr;
    this._emitter = emitter;
  }

  public start(ingredient: IngredientExtended, point: Point): void {
    this._emitting = true;
    this._emitter.setTint(ingredient.provided.base.color);
    this._emitter.setPosition(point.x, point.y);
    this._emitter.start();
  }

  public stop(): void {
    this._emitting = false;
    this._emitter.stop();
  }

  public checkCollision(
    scene: IScene,
    ingredient: IngredientExtended,
    callback: Function
  ): void {
    const glass = this._barCtr.glass;

    if (glass === undefined) {
      return;
    }

    this._emitter.forEachAlive(p => {
      if (glass.body.hitTest(p.x, p.y)) {
        p.lifeCurrent = 0;
        glass.addIngredient(ingredient.provided.base);
        callback();
      }
    }, scene);
  }

  public isEmitting(): boolean {
    return this._emitting;
  }
}
