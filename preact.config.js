import { resolve } from 'path';

import tailwindcss from 'tailwindcss';

export default {
  /**
   * Function that mutates the original webpack config.
   * Supports asynchronous changes when a promise is returned (or it's an async function).
   *
   * @param {object} config - original webpack config.
   * @param {object} env - options passed to the CLI.
   * @param {WebpackConfigHelpers} helpers - object with useful helpers for working with the webpack config.
   * @param {object} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
   **/
  webpack(config, env, helpers, options) {
    helpers.getLoadersByName(config, 'css-loader').forEach(({ loader }) => {
      loader.loader = 'typings-for-css-modules-loader';
      loader.options = Object.assign(loader.options, {
        camelCase: true,
        banner:
          '// This file is automatically generated from your CSS. Any edits will be overwritten.',
        namedExport: true,
        silent: true
      });
    });

    helpers.getLoadersByName(config, 'postcss-loader').forEach(({ loader }) => {
      loader.options.plugins = [
        tailwindcss('./tailwind.config.js'),
        ...loader.options.plugins
      ];
    });

    // Use any `index` file, not just index.js
    config.resolve.alias['preact-cli-entrypoint'] = resolve(
      process.cwd(),
      'src',
      'index'
    );

    config.resolve.modules.push(env.src);
  }
};
