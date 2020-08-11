import { IObjectDidChange, observe } from 'mobx';
import { Observable, Subject } from 'rxjs';

import { Inventory } from '../entities/Inventory';
import { IngredientExtended } from '../entities/dynamic/IngredientExtended';
import {
  CashChange,
  CocktailChange,
  EmployeeChange,
  IInventory,
  IngredientChange
} from '../entities/game/IInventory';
import { ProviderKey } from '../entities/static/Provider';

export class InventoryProxy implements IInventory {
  private readonly _inventory: Inventory;

  private readonly _cash$: Subject<CashChange> = new Subject();
  private readonly _ingredients$ = new Subject<IngredientChange>();
  private readonly _cocktails$: Subject<CocktailChange> = new Subject();
  private readonly _employees$ = new Subject<EmployeeChange>();

  public constructor(inventory: Inventory) {
    this._inventory = inventory;
  }

  public get current(): Readonly<Inventory> {
    return this._inventory;
  }

  public get cash$(): Observable<CashChange> {
    return this._cash$.asObservable();
  }

  public get ingredients$(): Observable<IngredientChange> {
    return this._ingredients$.asObservable().pipe();
  }

  public get cocktails$(): Observable<CocktailChange> {
    return this._cocktails$.asObservable();
  }

  public get employees$(): Observable<EmployeeChange> {
    return this._employees$;
  }

  public watch() {
    observe(
      this._inventory.cash$,
      change => {
        console.log('- Cash', change);
        this._cash$.next(change);
      },
      true
    );

    observe(this._inventory.ingredients$, change => {
      console.log('- Ingredients', change);
      switch (change.type) {
        case 'add':
          // add observe on provider (new value)
          return this.addIngredient(change);
        case 'update':
          // will never happen
          return this.updateIngredient(change);
        case 'remove':
          // dispose observe (old value)
          return this.removeIngredient(change);
      }
    });

    for (const providers of this._inventory.ingredients$.values()) {
      observe(providers, change => {
        console.log('- Providers', change);
        return this.updateIngredient(change);
      });
    }

    observe(this._inventory.cocktails$, change => {
      console.log('- Cocktail', change);
      this._cocktails$.next(change);
    });

    observe(this._inventory.employees$, change => {
      console.log('- Employee', change);
      this._employees$.next(change);
    });
  }

  public initIngredients(): void {
    for (const ingredient of this._inventory.ingredients.values()) {
      this._ingredients$.next({
        type: 'add',
        newValue: ingredient
      });
    }
  }

  public initEmployees(): void {
    for (const employee of this._inventory.employees) {
      this._employees$.next({
        type: 'add',
        newValue: employee
      });
    }
  }

  private addIngredient(change: IObjectDidChange): void {
    if (change.type !== 'add') {
      throw new Error('Wrong change type, expect add');
    }

    const providers: Map<ProviderKey, IngredientExtended> = change.newValue;
    const ingredient = providers.get(0);

    if (ingredient === undefined) {
      throw new Error('Can not find provider in providers map');
    }

    this._ingredients$.next({
      type: 'add',
      newValue: ingredient
    });
  }

  private updateIngredient(change: IObjectDidChange): void {
    if (change.type !== 'update') {
      throw new Error('Wrong change type, expect update');
    }

    this._ingredients$.next({
      type: 'update',
      newValue: change.newValue,
      oldValue: change.oldValue
    });
  }

  private removeIngredient(change: IObjectDidChange): void {
    if (change.type !== 'remove') {
      throw new Error('Wrong change type, expect remove');
    }

    const providers: Map<ProviderKey, IngredientExtended> = change.object;
    const ingredient = providers.get(change.name as number);

    if (ingredient === undefined) {
      throw new Error('Can not find provider in providers map');
    }

    this._ingredients$.next({
      type: 'remove',
      oldValue: change.oldValue
    });
  }
}
