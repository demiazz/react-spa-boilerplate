import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import reducers from './reducers';
import Root from './components/root';


// Use development tools for redux is available

const storeConstructor = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f,
)(createStore);

// Construct store

const store = storeConstructor(combineReducers({
  ...reducers, routing: routerReducer,
}));

// Sync browser history with store

const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Root} />
    </Router>
  </Provider>,
  document.getElementById('mount-point')
);
