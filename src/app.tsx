import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import Home from './routes/home';
import Profile from './routes/profile';
import NotFoundPage from './routes/notfound';
import NavComponent from './components/NavComponent';

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
          <Route path="/profile/" component={Profile} user="me" />
          <Route path="/profile/:user" component={Profile} />
          <NotFoundPage default />
        </Router>
      </div>
    </div>
  );
};

export default App;
