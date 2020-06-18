import { UserListener } from '../dto/UserDTO';
import { EmployeeKey } from '../entities/Employee';
import { IngredientKey } from '../entities/Ingredient';
import { Inventory } from '../entities/Inventory';
import { ProviderKey } from '../entities/Provider';
import { ClientEnv, ClientFactory, IClient } from './IClient';

export class Service {
  private readonly _client: IClient;

  constructor() {
    this._client = ClientFactory.BuildClient(ClientEnv.DEV);
  }

  public async createUser(email: string, password: string): Promise<void> {
    await this._client.createUser(email, password);
  }

  public async login(email: string, password: string): Promise<void> {
    await this._client.login(email, password);
  }

  public subscribe(subscriber: UserListener): void {
    this._client.subscribe(subscriber);
  }

  public async getInventory(): Promise<Inventory> {
    const dto = await this._client.fetchInventory();
    const inventory = Inventory.fromDTO(dto);
    inventory.attachService(this);
    return inventory;
  }

  public async setCash(cash: number): Promise<void> {
    await this._client.updateCash(cash);
  }

  public async addIngredient(
    ingredient: IngredientKey,
    provider: ProviderKey,
    stock: number
  ): Promise<void> {
    await this._client.updateIngredient({ ingredient, provider, stock });
  }

  public async removeIngredient(
    ingredient: IngredientKey,
    provider: ProviderKey,
    stock: number
  ): Promise<void> {
    await this._client.updateIngredient({ ingredient, provider, stock });
  }

  public async addEmployee(employee: EmployeeKey): Promise<void> {
    await this._client.updateEmployee(employee, true);
  }

  public async removeEmployee(employee: EmployeeKey): Promise<void> {
    await this._client.updateEmployee(employee, null);
  }
}
