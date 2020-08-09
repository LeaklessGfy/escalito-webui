import { observe } from 'mobx';

import { Inventory } from '../entities/Inventory';
import {
  CashChange,
  IInventory,
  IngredientChange
} from '../entities/game/IInventory';
import { Consumer } from './utils/Interfaces';

export class InventoryProxy implements IInventory {
  private readonly _inventory: Inventory;
  private readonly _cashWatchers: Consumer<CashChange>[] = [];
  private readonly _ingredientWatchers: Consumer<IngredientChange>[] = [];

  constructor(inventory: Inventory) {
    this._inventory = inventory;
  }

  public get current(): Readonly<Inventory> {
    return this._inventory;
  }

  public pushIngredients(change: IngredientChange) {}

  public watchCash(watcher: Consumer<CashChange>): void {
    this._cashWatchers.push(watcher);
  }

  public watchIngredients(watcher: Consumer<IngredientChange>): void {
    this._ingredientWatchers.push(watcher);
  }

  public watch() {
    observe(this._inventory.cash, change => {
      this._cashWatchers.forEach(watcher => watcher(change));
    });

    this._inventory._ingredients.forEach(providers => {
      observe(providers, change => {
        console.log(change);
      });
    });

    observe(this._inventory._ingredients, change => {
      console.log(change);
      // this._ingredientWatchers.forEach(watcher => watcher(change));
    });
  }
}
