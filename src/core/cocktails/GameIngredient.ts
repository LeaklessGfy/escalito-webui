import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IngredientType } from '../../entities/static/Ingredient';
import { IScene } from '../scenes/IScene';
import { Bottle } from './Bottle';

export interface GameIngredient {
  update(scene: IScene): void;
}

export function buildGameIngredient(
  scene: IScene,
  ingredient: IngredientExtended,
  emitter: Phaser.GameObjects.Particles.ParticleEmitter
): GameIngredient {
  switch (ingredient.provided.base.type) {
    case IngredientType.Bottle:
      return Bottle.build(scene, ingredient, emitter);
    case IngredientType.Fruits:
      return {
        update() {}
      };
  }
}
