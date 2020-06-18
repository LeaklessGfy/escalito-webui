import 'mobx-react-lite/batchingForReactDom';

import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import NavComponent from './components/NavComponent';
import Home from './routes/Home';
import Login from './routes/Login';
import NotFound from './routes/NotFound';
import { store, storeContext } from './store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
  // tslint:disable-next-line:no-var-requires
  require('preact/debug');
}

const App: FunctionalComponent = () => {
  return (
    <storeContext.Provider value={store}>
      <NavComponent />
      <div class="p-2">
        <Router>
          <Route path="/" component={Home} key="1" />
          <Route path="/login" component={Login} key="2" />
          <NotFound default />
        </Router>
      </div>

      <p class="text-center text-gray-500 text-xs mb-5">
        &copy;2020 Escalito. All rights reserved.
      </p>
    </storeContext.Provider>
  );
};

export default App;
