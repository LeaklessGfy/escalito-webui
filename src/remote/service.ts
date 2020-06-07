import { Client } from './firebase';

import { Inventory } from '../entities/Inventory';

export class Service {
  private readonly client: Client;
  private readonly userId: number;

  constructor() {
    this.client = new Client();
    this.userId = 1;
  }

  public async getInventory(): Promise<Inventory> {
    try {
      const dto = await this.client.fetchInventory(this.userId);
      return Inventory.fromDTO(dto);
    } catch (err) {
      throw err;
    }
  }
}

export const globalService = new Service();
