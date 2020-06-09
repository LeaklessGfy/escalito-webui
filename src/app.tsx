import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import NavComponent from './components/NavComponent';
import Home from './routes/home';
import NotFoundPage from './routes/notfound';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
  // tslint:disable-next-line:no-var-requires
  require('preact/debug');
}

const App: FunctionalComponent = () => {
  return (
    <div id="app">
      <NavComponent />
      <div class="p-2">
        <Router>
          <Route path="/" component={Home} />
          <NotFoundPage default />
        </Router>
      </div>
    </div>
  );
};

export default App;