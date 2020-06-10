import 'firebase/auth';
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

  public onAuthStateChanged: (user: firebase.User | null) => void = () => {};

  constructor(env: ClientEnv = ClientEnv.DEV) {
    this.env = env;
    this.app = !firebase.apps.length
      ? firebase.initializeApp(CONFIG)
      : firebase.app();

    this.app.auth().onAuthStateChanged(user => {
      this.onAuthStateChanged(user);
    });
  }

  public async createUser(email: string, password: string) {
    if (this.env === ClientEnv.PROD) {
      await this.app.auth().createUserWithEmailAndPassword(email, password);
    }
  }

  public async login(email: string, password: string) {
    if (this.env === ClientEnv.PROD) {
      await this.app.auth().signInWithEmailAndPassword(email, password);
    }
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

  public async writeValue<T>(ref: string, value: T): Promise<void> {
    if (this.env === ClientEnv.PROD) {
      await this.app
        .database()
        .ref(ref)
        .set(value);
    }
  }

  public async removeValue(ref: string): Promise<void> {
    this.writeValue(ref, null);
  }
}
