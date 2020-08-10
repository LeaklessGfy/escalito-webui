import { observer } from 'mobx-react-lite';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import { Provider } from '../../entities/static/Provider';
import { useStore } from '../../store';
import IngredientComponent from './IngredientBuyComponent';

const ShopComponent: FunctionalComponent = () => {
  const { inventory, providersArray } = useStore();
  const [active, setActive] = useState<Provider | undefined>(providersArray[0]);

  if (inventory === undefined) {
    return <div />;
  }

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
                key={ingredient.base.key}
                name={ingredient.base.name}
                disabled={inventory.isIngredientDisabled(ingredient)}
                actionName={'Buy ' + ingredient.price + '$'}
                onAction={() =>
                  inventory.addIngredient(
                    ingredient.base.key,
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
