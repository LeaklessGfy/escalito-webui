import 'firebase/auth';
import 'firebase/database';

import firebase from 'firebase/app';

import { userMock } from '../mocks/userMock';

const CONFIG = {
  apiKey: 'AIzaSyD89Uoox6OEt3ZfJWMDZ1HgDJ-_pf7e7vQ',
  authDomain: 'escalito-game.firebaseapp.com',
  databaseURL: 'https://escalito-game.firebaseio.com',
  projectId: 'escalito-game',
  storageBucket: 'escalito-game.appspot.com',
  messagingSenderId: '2528544922',
  appId: '1:2528544922:web:3d2c7861c33bd970d83723'
};

enum ClientEnv {
  DEV,
  PROD
}

export class Client {
  private readonly _env: ClientEnv;
  private readonly _app: firebase.app.App;

  public onAuthStateChanged: (
    user: firebase.UserInfo | null
  ) => void = () => {};

  constructor(env: ClientEnv = ClientEnv.DEV) {
    this._env = env;
    this._app = !firebase.apps.length
      ? firebase.initializeApp(CONFIG)
      : firebase.app();
    this._app.auth().onAuthStateChanged(this.onAuth.bind(this));

    console.info('** [CONSTRUCTED] **', ClientEnv[this._env]);
  }

  public async createUser(email: string, password: string) {
    console.info('-> [START] Create User', email, password);
    if (this._env === ClientEnv.PROD) {
      await this._app.auth().createUserWithEmailAndPassword(email, password);
    } else {
      this.onAuth(userMock);
    }
    console.info('<- [END] Create User', email, password);
  }

  public async login(email: string, password: string) {
    console.info('-> [START] Login', email, password);
    if (this._env === ClientEnv.PROD) {
      await this._app.auth().signInWithEmailAndPassword(email, password);
    } else {
      this.onAuth(userMock);
    }
    console.info('<- [END] Login', email, password);
  }

  public async fetchValue<T>(ref: string, defaultValue: T): Promise<T> {
    console.info('-> [START] Fetch value', ref);
    let value = defaultValue;
    if (this._env === ClientEnv.PROD) {
      const snapshot = await this._app
        .database()
        .ref(ref)
        .once('value');
      value = snapshot.val();
    }
    console.info('<- [END] Fetch value', ref, value);
    return value;
  }

  public async writeValue<T>(ref: string, value: T): Promise<void> {
    console.info('-> [START] Write value', ref, value);
    if (this._env === ClientEnv.PROD) {
      await this._app
        .database()
        .ref(ref)
        .set(value);
    }
    console.info('<- [END] Write value', ref, value);
  }

  public async removeValue(ref: string): Promise<void> {
    this.writeValue(ref, null);
  }

  private onAuth(user: firebase.UserInfo | null) {
    console.info('-> [START] Auth state changed', user);
    this.onAuthStateChanged(user);
    console.info('<- [END] Auth state changed', user);
  }
}
