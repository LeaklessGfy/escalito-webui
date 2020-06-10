import { EmployeeKey } from '../entities/Employee';
import { Inventory } from '../entities/Inventory';
import { inventoryMock } from '../mocks/inventoryMock';
import { Client } from './firebase';

export class Service {
  private readonly _client: Client;
  private readonly _tasks: Function[][];
  private readonly _listeners: ((user: firebase.UserInfo | null) => void)[];
  private _user: firebase.UserInfo | null;

  constructor() {
    this._client = new Client();
    this._tasks = [];
    this._listeners = [];
    this._user = null;
    this._client.onAuthStateChanged = this.onAuth.bind(this);
  }

  public addAuthListener(listener: (user: firebase.UserInfo | null) => void) {
    this._listeners.push(listener);
    listener(this._user);
  }

  public async getInventory(): Promise<Inventory> {
    const dto = await this._client.fetchValue(
      `inventory/${this._user?.uid}`,
      inventoryMock
    );
    const inventory = Inventory.fromDTO(dto);
    inventory.attachService(this);
    return inventory;
  }

  public async updateCash(cash: number): Promise<void> {
    await this._client.writeValue(`inventory/${this._user?.uid}/cash`, cash);
  }

  public async addEmployee(employeeKey: EmployeeKey): Promise<void> {
    await this._client.writeValue(
      `inventory/${this._user?.uid}/employee/${employeeKey}`,
      true
    );
  }

  public async removeEmployee(employeeKey: EmployeeKey): Promise<void> {
    await this._client.removeValue(
      `inventory/${this._user?.uid}/employee/${employeeKey}`
    );
  }

  public async createUser(
    email: string,
    password: string
  ): Promise<firebase.User> {
    const promise = new Promise<firebase.User>((resolve, reject) => {
      this._tasks.push([resolve, reject]);
      setTimeout(() => reject('Timeout'), 2000);
    });
    await this._client.createUser(email, password);
    return await promise;
  }

  public async login(email: string, password: string): Promise<firebase.User> {
    const promise = new Promise<firebase.User>((resolve, reject) => {
      this._tasks.push([resolve, reject]);
      setTimeout(() => reject('Timeout'), 2000);
    });
    await this._client.login(email, password);
    return await promise;
  }

  private onAuth(user: firebase.UserInfo | null): void {
    this._user = user;

    while (this._tasks.length > 0) {
      const task = this._tasks.pop();
      if (task !== undefined) {
        const [resolve, reject] = task;
        if (user) resolve(user);
        else reject('Unlogged');
      }
    }

    for (const listener of this._listeners) {
      listener(user);
    }
  }
}
