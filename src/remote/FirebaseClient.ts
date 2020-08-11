import 'firebase/auth';
import 'firebase/database';

import firebase from 'firebase/app';

import {
  CocktailDto,
  IngredientDto,
  InventoryDto
} from '../entities/dto/InventoryDTO';
import { UserDto, UserListener } from '../entities/dto/UserDTO';
import { IClient } from './IClient';

const CONFIG = {
  apiKey: 'AIzaSyD89Uoox6OEt3ZfJWMDZ1HgDJ-_pf7e7vQ',
  authDomain: 'escalito-game.firebaseapp.com',
  databaseURL: 'https://escalito-game.firebaseio.com',
  projectId: 'escalito-game',
  storageBucket: 'escalito-game.appspot.com',
  messagingSenderId: '2528544922',
  appId: '1:2528544922:web:3d2c7861c33bd970d83723'
};

export class FirebaseClient implements IClient {
  private readonly _app: firebase.app.App;
  private readonly _subscribers: UserListener[];

  private _user: UserDto;

  public constructor() {
    this._app = !firebase.apps.length
      ? firebase.initializeApp(CONFIG)
      : firebase.app();
    this._subscribers = [];
    this._user = null;

    this._app.auth().onAuthStateChanged(user => {
      console.info('-> [START] Auth state changed', user);
      this._user = user;
      for (const subscriber of this._subscribers) {
        subscriber(user);
      }
      console.info('<- [END] Auth state changed', user);
    });

    console.info('** [CONSTRUCTED] **');
  }

  // AUTH
  public async createUser(email: string, password: string): Promise<void> {
    console.info('-> [START] Create User', email, password);
    await this._app.auth().createUserWithEmailAndPassword(email, password);
    console.info('<- [END] Create User', email, password);
  }

  public async login(email: string, password: string): Promise<void> {
    console.info('-> [START] Login', email, password);
    await this._app.auth().signInWithEmailAndPassword(email, password);
    console.info('<- [END] Login', email, password);
  }

  public subscribe(subscriber: UserListener): void {
    this._subscribers.push(subscriber);
  }

  // FETCH
  public async fetchInventory(): Promise<InventoryDto> {
    return this.fetchValue(this.ref);
  }

  // UPDATE
  public async updateCash(cash: number): Promise<void> {
    await this.writeValue(`${this.ref}/cash`, cash);
  }

  public async updateIngredient(dto: IngredientDto): Promise<void> {
    const key = dto.ingredient + '|' + dto.provider;
    const value = dto.stock > 0 ? dto : null;
    await this.writeValue(`${this.ref}/ingredients/${key}`, value);
  }

  public async updateCocktail(
    dto: CocktailDto,
    value: true | null
  ): Promise<void> {
    const key = dto.cocktail;
    await this.writeValue(`${this.ref}/cocktails/${key}`, value ? dto : null);
  }

  public async updateEmployee(key: number, value: true | null): Promise<void> {
    await this.writeValue(`${this.ref}/employees/${key}`, value);
  }

  // PRIMITIVES
  private get ref(): string {
    return `inventory/${this._user?.uid}`;
  }

  private async fetchValue<T>(ref: string): Promise<T> {
    console.info('-> [START] Fetch value', ref);
    const snapshot = await this._app
      .database()
      .ref(ref)
      .once('value');
    const value = snapshot.val();
    console.info('<- [END] Fetch value', ref, value);
    return value;
  }

  private async writeValue<T>(ref: string, value: T): Promise<void> {
    console.info('-> [START] Write value', ref, value);
    await this._app
      .database()
      .ref(ref)
      .set(value);
    console.info('<- [END] Write value', ref, value);
  }
}
