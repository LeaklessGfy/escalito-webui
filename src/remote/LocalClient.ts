import { CocktailDto, IngredientDto, InventoryDto } from '../dto/InventoryDTO';
import { UserDto, UserListener } from '../dto/UserDTO';
import { IClient } from './IClient';

export class LocalClient implements IClient {
  private readonly _subscribers: UserListener[] = [];

  public async createUser(email: string, password: string): Promise<void> {
    const user: UserDto = {
      uid: '1',
      displayName: email,
      email: email,
      phoneNumber: '',
      photoURL: '',
      providerId: ''
    };
    await this.writeValue('user', user);
    this._subscribers.forEach(s => s(user));
  }

  public async login(email: string, password: string): Promise<void> {
    const user = await this.fetchValue<UserDto>('user', null);
    this._subscribers.forEach(s => s(user));
  }

  public subscribe(subscriber: UserListener): void {
    this._subscribers.push(subscriber);
    this.fetchValue<UserDto>('user', null).then(user => subscriber(user));
  }

  // FETCH
  public async fetchInventory(): Promise<InventoryDto> {
    const cash = await this.fetchValue<number>('cash', 0);
    const ingredients = await this.fetchValue<IngredientDto[]>(
      'ingredients',
      []
    );
    const cocktails = await this.fetchValue<CocktailDto[]>('cocktails', []);
    const employees = await this.fetchValue<number[]>('employees', []);

    return {
      cash,
      ingredients,
      cocktails,
      employees
    };
  }

  // UPDATE
  public async updateCash(cash: number): Promise<void> {
    await this.writeValue('cash', cash);
  }

  public async updateIngredient(dto: IngredientDto): Promise<void> {
    const ingredients = await this.fetchValue<IngredientDto[]>(
      'ingredients',
      []
    );
    const filters = ingredients.filter(
      i => i.ingredient !== dto.ingredient && i.provider !== dto.provider
    );
    if (dto.stock > 0) {
      filters.push(dto);
    }
    this.writeValue('ingredients', filters);
  }

  public async updateCocktail(
    dto: CocktailDto,
    value: true | null
  ): Promise<void> {
    const cocktails = await this.fetchValue<CocktailDto[]>('cocktails', []);
    const filters = cocktails.filter(c => c.cocktail !== dto.cocktail);
    if (value) {
      filters.push(dto);
    }
    this.writeValue('cocktails', filters);
  }

  public async updateEmployee(
    employee: number,
    value: true | null
  ): Promise<void> {
    const employees = await this.fetchValue<number[]>('employees', []);
    const filters = employees.filter(e => e !== employee);
    if (value) {
      filters.push(employee);
    }
    this.writeValue('employees', filters);
  }

  // PRIMITIVES
  private async fetchValue<T>(key: string, defaultValue: T): Promise<T> {
    const str = localStorage.getItem(key);
    if (str === null) {
      return defaultValue;
    }
    return JSON.parse(str);
  }

  private async writeValue<T>(key: string, value: T): Promise<void> {
    const str = JSON.stringify(value);
    localStorage.setItem(key, str);
  }
}
