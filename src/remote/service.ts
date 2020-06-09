import { EmployeeKey } from '../entities/Employee';
import { Inventory } from '../entities/Inventory';
import { inventoryMock } from '../mocks/inventoryMock';
import { Client } from './firebase';

export class Service {
  private readonly _client: Client;
  private readonly _userId: string;

  constructor() {
    this._client = new Client();
    this._userId = '1';
  }

  public async getInventory(): Promise<Inventory> {
    const dto = await this._client.fetchValue(
      `inventory/${this._userId}`,
      inventoryMock
    );
    return Inventory.fromDTO(dto);
  }

  public async updateCash(cash: number): Promise<boolean> {
    return await this._client.writeValue(
      `inventory/${this._userId}/cash`,
      cash
    );
  }

  public async addEmployee(employeeKey: EmployeeKey): Promise<boolean> {
    return await this._client.writeValue(
      `inventory/${this._userId}/employee/${employeeKey}`,
      true
    );
  }

  public async removeEmployee(employeeKey: EmployeeKey): Promise<boolean> {
    return await this._client.removeValue(
      `inventory/${this._userId}/employee/${employeeKey}`
    );
  }
}
