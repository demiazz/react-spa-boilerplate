import React from 'react';

import { jss } from '../styles';


export default class Root extends React.Component {
  render() {
    const { root } = styleSheet.classes; // eslint-disable-line

    return <div className={ root }>Hello, browser!</div>;
  }
}


export const styleSheet = jss.createStyleSheet({
  root: {
    color: 'red',
  },
}).attach();


if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.dispose(::styleSheet.detach);
  }
}
