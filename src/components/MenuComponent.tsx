import { observer } from 'mobx-preact';
import { FunctionalComponent, h } from 'preact';

import { useStore } from '../store';
import CocktailComponent from './CocktailComponent';

const MenuComponent: FunctionalComponent = () => {
  const { inventory, cocktails } = useStore();

  return (
    <section class="rounded overflow-hidden shadow-lg px-6 py-4">
      <header class="border-b-2">
        <h2>Menu</h2>
      </header>

      <div class="grid grid-cols-3">
        {Array.from(cocktails.values()).map(cocktail => (
          <CocktailComponent
            key={cocktail.key}
            name={cocktail.name}
            price={inventory.getCocktailPrice(cocktail.key)}
            recipe={cocktail.recipe}
            disabled={inventory.isCocktailDisabled(cocktail)}
            added={inventory.hasCocktail(cocktail.key)}
            onAdd={() => inventory.addCocktail(cocktail)}
            onRemove={() => inventory.removeCocktail(cocktail.key)}
          />
        ))}
      </div>
    </section>
  );
};

export default observer(MenuComponent);
