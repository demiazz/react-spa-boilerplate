import { jsdom } from 'jsdom';

// NOTE: emulate browser environment with `jsdom`.
global.document = jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;

// NOTE: some libraries use `__DEV__` constant for showing some development
//       information. For example, `react-router` use it for showing warnings.
//       In test environment we don't have webpack plugins, because just
//       define this constant and set it to `false`.
global.__DEV__ = true; // eslint-disable-line


// NOTE: mock function for unloadable modules.
function noop() { }

// NOTE: don't load anything, if module require other `.css` module.
require.extensions['.css'] = noop;
