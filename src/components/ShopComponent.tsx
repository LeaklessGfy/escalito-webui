import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import { Inventory } from '../entities/Inventory';
import { Provider } from '../entities/Provider';

import IngredientComponent from './IngredientComponent';
import { observer } from 'mobx-preact';

interface ShopComponentProps {
  inventory: Inventory;
  providers: Provider[];
}

const ShopComponent: FunctionalComponent<ShopComponentProps> = props => {
  const [active, setActive] = useState(props.providers[0]);

  return (
    <section class="rounded overflow-hidden shadow-lg px-6 py-4">
      <header class="border-b-2 flex justify-between">
        <h2>Shop</h2>

        <em>{props.inventory.cash}$</em>
      </header>

      <div class="mt-5 flex justify-between">
        <aside class="mr-10">
          <ul class="border rounded">
            {props.providers.map(provider => (
              <li
                key={provider.name}
                class="px-4 py-2 border-b last:border-b-0 cursor-pointer"
                onClick={() => setActive(provider)}
              >
                {provider.name}
              </li>
            ))}
          </ul>
        </aside>

        <section class="rounded flex-grow">
          {Array.from(active.ingredients.values()).map((ingredient, index) => (
            <IngredientComponent
              key={index}
              name={ingredient.name}
              price={ingredient.price}
              stock={props.inventory.getStock(active.key, ingredient.key)}
              disabled={props.inventory.cash < ingredient.price}
              onAdd={() =>
                props.inventory.addIngredient(active.key, ingredient.key)
              }
              onRemove={() =>
                props.inventory.removeIngredient(active.key, ingredient.key)
              }
            />
          ))}
        </section>
      </div>
    </section>
  );
};

export default observer(ShopComponent);
