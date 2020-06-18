import { observer } from 'mobx-react-lite';
import { FunctionalComponent, h } from 'preact';

import { useStore } from '../../store';

const HireComponent: FunctionalComponent = () => {
  const { inventory, employeesArray } = useStore();

  return (
    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Hire</h2>
      </header>

      <div class="card-body">
        <ul class="list">
          {employeesArray.map(employee => (
            <li key={employee.key} class="list-item flex items-center bg-white">
              <p class="flex-grow">{employee.name}</p>

              {inventory.hasEmployee(employee.key) ? (
                <button
                  class="btn bg-red-500"
                  onClick={() => inventory.removeEmployee(employee.key)}
                >
                  Fire
                </button>
              ) : (
                <button
                  class="btn bg-green-500"
                  disabled={inventory.cash < employee.price}
                  onClick={() => inventory.addEmployee(employee)}
                >
                  Hire {employee.price}$
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default observer(HireComponent);
