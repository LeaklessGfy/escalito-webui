import { Consumer } from '../../core/utils/Interfaces';
import { Inventory } from '../Inventory';
import { IngredientExtended } from '../dynamic/IngredientExtended';
import { IngredientKey } from '../static/Ingredient';

export declare type Change<K, T> =
  | {
      name: K;
      type: 'add';
      newValue: T;
    }
  | {
      name: K;
      type: 'update';
      oldValue: T;
      newValue: T;
    }
  | {
      name: K;
      type: 'remove';
      oldValue: T;
    };

export declare type CashChange = Change<any, number>;
export declare type IngredientChange = Change<
  IngredientKey,
  IngredientExtended
>;

export interface IInventory {
  readonly current: Readonly<Inventory>;

  watchCash(watcher: Consumer<CashChange>): void;
  watchIngredients(watcher: Consumer<IngredientChange>): void;
}
