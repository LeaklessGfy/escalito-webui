import { FunctionalComponent, h } from 'preact';

interface IngredientComponentProps {
  name: string;
  price: number;
  stock: number;
  disabled: boolean;

  onRemove?: () => void;
  onAdd?: () => void;
}

const IngredientComponent: FunctionalComponent<IngredientComponentProps> = props => {
  return (
    <article class="max-w-xs bg-white rounded overflow-hidden shadow-lg px-6 py-4">
      <header>
        <h4 class="font-bold text-xl text-teal-500 mb-2">{props.name}</h4>
      </header>

      <div>
        <p class="text-gray-700 text-base">
          Price : {props.price * props.stock}$ / Day
        </p>
      </div>

      <footer class="border-t-2 mt-2 pt-2 grid grid-cols-2 items-center text-center">
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={props.stock === 0}
          onClick={props.onRemove}
        >
          - {props.price}$
        </button>

        <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={props.disabled}
          onClick={props.onAdd}
        >
          + {props.price}$
        </button>
      </footer>
    </article>
  );
};

export default IngredientComponent;
