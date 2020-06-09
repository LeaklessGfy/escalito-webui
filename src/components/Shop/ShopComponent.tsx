import { observer } from 'mobx-preact';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import { Provider } from '../../entities/Provider';
import { useStore } from '../../store';
import IngredientComponent from './IngredientComponent';

const ShopComponent: FunctionalComponent = () => {
  const { inventory, providersArray } = useStore();
  const [active, setActive] = useState<Provider | undefined>(providersArray[0]);

  return (
    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Shop</h2>

        <em>{inventory.cash}$</em>
      </header>

      <div class="card-body flex justify-between">
        <aside class="mr-10">
          <ul class="list bg-white">
            {providersArray.map(provider => (
              <li
                key={provider.key}
                class="list-item"
                onClick={() => setActive(provider)}
              >
                {provider.name}
              </li>
            ))}
          </ul>
        </aside>

        <section class="flex-grow grid grid-cols-3">
          {active &&
            active.ingredientsArray.map(ingredient => (
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
