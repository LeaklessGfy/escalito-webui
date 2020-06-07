import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import IngredientComponent from './IngredientComponent';
import { observer } from 'mobx-preact';
import { useStore } from '../store';

const ShopComponent: FunctionalComponent = () => {
  const { inventory, providers } = useStore();
  const [active, setActive] = useState(providers[0]);

  return (
    <section class="rounded overflow-hidden shadow-lg px-6 py-4">
      <header class="border-b-2 flex justify-between">
        <h2>Shop</h2>

        <em>{inventory.cash}$</em>
      </header>

      <div class="mt-5 flex justify-between">
        <aside class="mr-10">
          <ul class="border rounded">
            {providers.map(provider => (
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

        <section class="rounded flex-grow grid grid-cols-3">
          {Array.from(active.ingredients.values()).map((ingredient, index) => (
            <IngredientComponent
              key={index}
              name={ingredient.name}
              price={ingredient.price}
              stock={inventory.getStock(active.key, ingredient.key)}
              disabled={inventory.isIngredientDisabled(active.key, ingredient)}
              onAdd={() => inventory.addIngredient(active.key, ingredient.key)}
              onRemove={() =>
                inventory.removeIngredient(active.key, ingredient.key)
              }
            />
          ))}
        </section>
      </div>
    </section>
  );
};

export default observer(ShopComponent);
