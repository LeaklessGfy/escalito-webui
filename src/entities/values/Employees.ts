import { Employee, EmployeeKey } from '../static/Employee';

function buildEmployees(): Map<EmployeeKey, Employee> {
  const map: Map<EmployeeKey, Employee> = new Map();
  map.set(EmployeeKey.BodyGuard, new Employee(EmployeeKey.BodyGuard, 100, 50));
  return map;
}

let employees: Map<EmployeeKey, Employee> | undefined = undefined;

export const Employees = () => {
  if (employees === undefined) {
    employees = buildEmployees();
  }
  return employees;
};
