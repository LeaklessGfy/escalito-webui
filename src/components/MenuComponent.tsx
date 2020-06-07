import { FunctionalComponent, h } from 'preact';
import CocktailComponent from './CocktailComponent';
import { useStore } from '../store';
import { observer } from 'mobx-preact';

const MenuComponent: FunctionalComponent = () => {
  const { inventory, cocktails } = useStore();

  console.log('Render');

  return (
    <section class="rounded overflow-hidden shadow-lg px-6 py-4">
      <header class="border-b-2">
        <h2>Menu</h2>
      </header>

      <div class="grid grid-cols-3">
        {cocktails.map(cocktail => (
          <CocktailComponent
            key={cocktail.key}
            name={cocktail.name}
            price={cocktail.price}
            recipe={cocktail.getRecipe()}
            disabled={inventory.isCocktailDisabled(cocktail)}
            isOnMenu={inventory.hasCocktail(cocktail)}
            onAdd={() => inventory.addCocktail(cocktail)}
          />
        ))}
      </div>
    </section>
  );
};

export default observer(MenuComponent);
