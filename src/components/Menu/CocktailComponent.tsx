import { FunctionalComponent, h } from 'preact';

import { IngredientKey, IngredientNames } from '../../entities/Ingredient';

interface CocktailComponentProps {
  name: string;
  price: number;
  recipe: Map<IngredientKey, number>;
  disabled: boolean;
  added: boolean;

  onAdd?: () => void;
  onRemove?: () => void;
}

const CocktailComponent: FunctionalComponent<CocktailComponentProps> = props => {
  return (
    <article class="card max-w-xs bg-white">
      <header>
        <h4 class="card-title">{props.name}</h4>
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

      <footer class="card-footer">
        {!props.added && (
          <button
            class="w-full btn bg-green-500 hover:bg-green-700"
            disabled={props.disabled}
            onClick={props.onAdd}
          >
            Add to Menu
          </button>
        )}

        {props.added && <input type="number" value={props.price} />}
      </footer>
    </article>
  );
};

export default CocktailComponent;
