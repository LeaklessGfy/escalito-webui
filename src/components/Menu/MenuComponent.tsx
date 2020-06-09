import { observer } from 'mobx-preact';
import { FunctionalComponent, h } from 'preact';

import { useStore } from '../../store';
import CocktailComponent from './CocktailComponent';

const MenuComponent: FunctionalComponent = () => {
  const { inventory, cocktailsArray } = useStore();

  return (
    <section class="card">
      <header class="card-header">
        <h2 class="card-title">Menu</h2>
      </header>

      <div class="card-body grid grid-cols-3">
        {cocktailsArray.map(cocktail => (
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
