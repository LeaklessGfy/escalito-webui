import { observer } from 'mobx-preact';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import { Provider } from '../entities/Provider';
import { useStore } from '../store';
import IngredientComponent from './IngredientComponent';

const ShopComponent: FunctionalComponent = () => {
  const { inventory, providers } = useStore();
  const [active, setActive] = useState<Provider | undefined>(undefined);

  return (
    <section class="rounded overflow-hidden shadow-lg px-6 py-4">
      <header class="border-b-2 flex justify-between">
        <h2>Shop</h2>

        <em>{inventory.cash}$</em>
      </header>

      <div class="mt-5 flex justify-between">
        <aside class="mr-10">
          <ul class="border rounded">
            {Array.from(providers.values()).map(provider => (
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
          {active &&
            active.ingredients.map(ingredient => (
              <IngredientComponent
                key={ingredient.key}
                name={ingredient.name}
                price={ingredient.price}
                stock={inventory.getIngredientStock(
                  ingredient.key,
                  ingredient.providerKey
                )}
                disabled={inventory.isIngredientDisabled(ingredient)}
                onAdd={() =>
                  inventory.addIngredient(
                    ingredient.key,
                    ingredient.providerKey
                  )
                }
                onRemove={() =>
                  inventory.removeIngredient(
                    ingredient.key,
                    ingredient.providerKey
                  )
                }
              />
            ))}
        </section>
      </div>
    </section>
  );
};

export default observer(ShopComponent);
