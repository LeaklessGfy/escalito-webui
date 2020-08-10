import { Observable } from 'rxjs';

import { Inventory } from '../Inventory';
import { CocktailExtended } from '../dynamic/CocktailExtended';
import { IngredientExtended } from '../dynamic/IngredientExtended';
import { Employee } from '../static/Employee';

export declare type Change<T> =
  | {
      type: 'add';
      newValue: T;
    }
  | {
      type: 'update';
      oldValue: T;
      newValue: T;
    }
  | {
      type: 'remove';
      oldValue: T;
    };

export declare type CashChange = {
  type: 'update';
  newValue: number | undefined;
  oldValue: number | undefined;
};

export declare type IngredientChange = Change<IngredientExtended>;

export declare type CocktailChange = Change<CocktailExtended>;

export declare type EmployeeChange = Change<Employee>;

export interface IInventory {
  readonly current: Readonly<Inventory>;
  readonly cash$: Observable<CashChange>;
  readonly ingredients$: Observable<IngredientChange | undefined>;
  readonly cocktails$: Observable<CocktailChange>;
  readonly employees$: Observable<EmployeeChange | undefined>;
}
