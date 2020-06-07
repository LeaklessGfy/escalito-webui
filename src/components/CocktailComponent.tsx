import { FunctionalComponent, h } from 'preact';
import { IngredientKey, IngredientNames } from '../entities/Ingredient';

interface CocktailComponentProps {
  name: string;
  price: number;
  recipe: Map<IngredientKey, number>;
  disabled: boolean;
  isOnMenu: boolean;

  onAdd?: () => void;
  onRemove?: () => void;
}

const CocktailComponent: FunctionalComponent<CocktailComponentProps> = props => {
  return (
    <article class="max-w-xs bg-white rounded overflow-hidden shadow-lg px-6 py-4 mt-2">
      <header>
        <h4 class="font-bold text-xl text-teal-500 mb-2">{props.name}</h4>
      </header>

      <div class="h-20">
        <ul>
          {Array.from(props.recipe.entries()).map(([ingredient, nb]) => (
            <li key={ingredient}>
              <p class="text-gray-700 text-base">
                {IngredientNames[ingredient]} - {nb}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <footer class="border-t-2 mt-2 pt-2 items-center text-center">
        {!props.isOnMenu && (
          <button
            class="w-full py-2 px-4 text-white font-bold bg-green-500 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:shadow-outline"
            disabled={props.disabled}
            onClick={props.onAdd}
          >
            Add to Menu
          </button>
        )}

        {props.isOnMenu && <input type="number" value={props.price} />}
      </footer>
    </article>
  );
};

export default CocktailComponent;
