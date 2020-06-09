import 'firebase/database';

import firebase from 'firebase/app';

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
  private readonly env: ClientEnv;
  private readonly app: firebase.app.App;

  constructor(env: ClientEnv = ClientEnv.DEV) {
    this.env = env;
    this.app = !firebase.apps.length
      ? firebase.initializeApp(CONFIG)
      : firebase.app();
  }

  public async fetchValue<T>(ref: string, defaultValue: T): Promise<T> {
    if (this.env === ClientEnv.PROD) {
      const snapshot = await this.app
        .database()
        .ref(ref)
        .once('value');

      return snapshot.val();
    }
    return defaultValue;
  }

  public async writeValue<T>(ref: string, value: T): Promise<boolean> {
    if (this.env === ClientEnv.PROD) {
      await this.app
        .database()
        .ref(ref)
        .set(value);
    }
    return true;
  }

  public async removeValue(ref: string): Promise<boolean> {
    if (this.env === ClientEnv.PROD) {
      await this.app
        .database()
        .ref(ref)
        .set(null);
    }
    return true;
  }
}
