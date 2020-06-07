import firebase from 'firebase/app';
import 'firebase/database';

import { InventoryDTO } from '../dto/InventoryDTO';
import { inventoryMock } from '../mocks/inventoryMock';

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

  constructor() {
    this.env = ClientEnv.DEV;
    this.app = firebase.initializeApp(CONFIG);
  }

  public async fetchInventory(userId: number): Promise<InventoryDTO> {
    if (this.env === ClientEnv.PROD) {
      return await this.fetchValue(`inventory/${userId}`);
    }
    return inventoryMock;
  }

  private async fetchValue<T>(ref: string): Promise<T> {
    try {
      const snapshot = await this.app
        .database()
        .ref(ref)
        .once('value');

      return snapshot.val();
    } catch (err) {
      throw err;
    }
  }
}
