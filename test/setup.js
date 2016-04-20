import { jsdom } from 'jsdom';

global.document = jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;

// Mockup non JS resources

function noop() { }

require.extensions['.css'] = noop;
