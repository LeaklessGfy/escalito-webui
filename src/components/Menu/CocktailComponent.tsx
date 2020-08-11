import { FunctionalComponent, h } from 'preact';

import {
  IngredientKey,
  IngredientNames
} from '../../entities/static/Ingredient';

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
    <article class="card bg-white mx-2">
      <header class="border-b-2 mb-2">
        <h4 class="card-title">{props.name}</h4>
      </header>

      <div class="">
        <h5 class="font-bold text-gray-500 mb-2">Recipe</h5>

        <table class="table-auto w-full">
          <thead>
            <tr>
              <th class="text-gray-700 px-4 py-2">Ingredient</th>
              <th class="text-gray-700 px-4 py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(props.recipe.entries()).map(([ingredient, nb]) => (
              <tr key={ingredient}>
                <td class="border px-4 py-2 text-gray-700 text-base">
                  {IngredientNames[ingredient]}
                </td>
                <td class="border px-4 py-2">{nb}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h5 class="font-bold text-gray-500 my-2">Price</h5>
        <div class="flex justify-between">
          <button class="btn bg-red-500">-</button>
          <p class="font-bold text-3xl text-blue-500 text-center">
            {props.price}$
          </p>
          <button class="btn bg-green-500">+</button>
        </div>
      </div>

      <footer class="card-footer">
        {!props.added ? (
          <button
            class="w-full btn bg-green-500 hover:bg-green-700"
            disabled={props.disabled}
            onClick={props.onAdd}
          >
            Add
          </button>
        ) : (
          <button
            class="w-full btn bg-red-500 hover:bg-red-700"
            disabled={props.disabled}
            onClick={props.onRemove}
          >
            Remove
          </button>
        )}
      </footer>
    </article>
  );
};

export default CocktailComponent;
