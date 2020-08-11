import { Character, CharacterKey } from './Character';

export enum EmployeeKey {
  Barmaid,
  BodyGuard,
  Waitress,
  Delivery
}

const EmployeeNames: { [key in EmployeeKey]: string } = {
  [EmployeeKey.Barmaid]: 'Barmaid',
  [EmployeeKey.BodyGuard]: 'Body Guard',
  [EmployeeKey.Waitress]: 'Waitress',
  [EmployeeKey.Delivery]: 'Delivery'
};

export class Employee extends Character {
  public readonly subKey: EmployeeKey;
  public readonly name: string;
  public readonly price: number;
  public readonly salary: number;

  public constructor(subKey: EmployeeKey, price: number, salary: number) {
    super(CharacterKey.Employee);
    this.subKey = subKey;
    this.name = EmployeeNames[subKey];
    this.price = price;
    this.salary = salary;
  }
}
