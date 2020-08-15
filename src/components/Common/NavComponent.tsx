import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router';

const NavComponent: FunctionalComponent = () => {
  return (
    <nav class="flex items-center justify-between flex-wrap bg-teal-500 px-5 py-3">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <Link class="font-semibold text-xl tracking-tight" href="/">
          Escalito
        </Link>
      </div>
    </nav>
  );
};

export default NavComponent;
