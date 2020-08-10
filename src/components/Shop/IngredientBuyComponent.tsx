import { FunctionalComponent, h } from 'preact';

interface IngredientComponentProps {
  name: string;
  disabled: boolean;
  actionName: string;

  onAction?: () => void;
}

const IngredientBuyComponent: FunctionalComponent<IngredientComponentProps> = props => {
  return (
    <article class="card max-w-xs bg-white mt-2">
      <header>
        <h4 class="card-title">{props.name}</h4>
      </header>

      <footer class="card-footer">
        <button
          class="btn w-full bg-green-500 hover:bg-green-700"
          disabled={props.disabled}
          onClick={props.onAction}
        >
          {props.actionName}
        </button>
      </footer>
    </article>
  );
};

export default IngredientBuyComponent;
