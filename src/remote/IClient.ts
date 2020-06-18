import {
  ICocktailDTO,
  IIngredientDTO,
  IInventoryDTO
} from '../dto/InventoryDTO';
import { UserListener } from '../dto/UserDTO';
import { FirebaseClient } from './FirebaseClient';
import { LocalClient } from './LocalClient';

export interface IClient {
  // AUTH
  createUser(email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<void>;
  subscribe(subscriber: UserListener): void;

  // FETCH
  fetchInventory(): Promise<IInventoryDTO>;

  // UPDATE
  updateCash(cash: number): Promise<void>;
  updateIngredient(dto: IIngredientDTO): Promise<void>;
  updateCocktail(dto: ICocktailDTO, value: true | null): Promise<void>;
  updateEmployee(employee: number, value: true | null): Promise<void>;
}

export enum ClientEnv {
  DEV,
  PROD
}

export class ClientFactory {
  public static BuildClient(env: ClientEnv): IClient {
    if (env === ClientEnv.PROD) {
      return new FirebaseClient();
    }
    return new LocalClient();
  }
}
