export enum EmployeeKey {
  Barmaid,
  BodyGuard,
  Waitress,
  Delivery
}

export const EmployeeNames: { [key in EmployeeKey]: string } = {
  [EmployeeKey.Barmaid]: 'Barmaid',
  [EmployeeKey.BodyGuard]: 'Body Guard',
  [EmployeeKey.Waitress]: 'Waitress',
  [EmployeeKey.Delivery]: 'Delivery'
};

export class Employee {
  public readonly key: EmployeeKey;
  public readonly price: number;
  public readonly salary: number;

  constructor(key: EmployeeKey, price: number, salary: number) {
    this.key = key;
    this.price = price;
    this.salary = salary;
  }

  public get name(): string {
    return EmployeeNames[this.key];
  }
}

function buildEmployees(): Map<EmployeeKey, Employee> {
  const map: Map<EmployeeKey, Employee> = new Map();
  map.set(EmployeeKey.BodyGuard, new Employee(EmployeeKey.BodyGuard, 100, 50));
  return map;
}

export const Employees = buildEmployees();
