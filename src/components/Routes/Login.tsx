import { observer } from 'mobx-react-lite';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';

import { useStore } from '../../store';

enum AuthType {
  LOGIN,
  CREATE
}

const Login: FunctionalComponent = () => {
  const { ready, user, service } = useStore();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  console.log('Render Login');

  if (ready && user !== null) {
    route('/');
    return <div />;
  }

  const onSubmit = (auth: AuthType) => {
    if (auth === AuthType.CREATE) {
      service.createUser(email, password);
    } else {
      service.login(email, password);
    }
  };

  return (
    <main>
      <form class="card" onSubmit={() => onSubmit(AuthType.LOGIN)}>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>

          <input
            id="email"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="j.doe@gmail.com"
            value={email}
            required
            onChange={e => setEmail(e.currentTarget.value)}
          />
        </div>

        <div class="mb-4">
          <label
            for="password"
            class="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="********"
            value={password}
            required
            onChange={e => setPassword(e.currentTarget.value)}
          />
        </div>

        <div class="flex items-center">
          <button
            type="button"
            class="btn bg-indigo-500 hover:bg-indigo-700 mr-2"
            onClick={() => onSubmit(AuthType.CREATE)}
          >
            Create
          </button>

          <button
            type="button"
            class="btn bg-blue-500 hover:bg-blue-700"
            onClick={() => onSubmit(AuthType.LOGIN)}
          >
            Login
          </button>
        </div>
      </form>
    </main>
  );
};

export default observer(Login);
