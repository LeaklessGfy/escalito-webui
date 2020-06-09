import { FunctionalComponent, h } from 'preact';

interface IngredientComponentProps {
  name: string;
  price: number;
  stock: number;
  disabled: boolean;

  onAdd?: () => void;
  onRemove?: () => void;
}

const IngredientComponent: FunctionalComponent<IngredientComponentProps> = props => {
  return (
    <article class="card max-w-xs bg-white mt-2">
      <header>
        <h4 class="card-title">{props.name}</h4>
      </header>

      <div class="card-content">
        <p>
          Price : {props.price * props.stock}$ / Day <br />
          Stock : {props.stock} / Day
        </p>
      </div>

      <footer class="card-footer grid grid-cols-2">
        <button
          class="btn bg-red-500 hover:bg-red-700"
          disabled={props.stock === 0}
          onClick={props.onRemove}
        >
          - {props.price}$
        </button>

        <button
          class="btn bg-green-500 hover:bg-green-700"
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
