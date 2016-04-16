import React from 'react';

import { jss, theme } from '../styles';


const styles = jss.createStyleSheet({
  container: {
    position: 'fixed',
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    color: theme.textColor,
    fontSize: theme.textSize,
  },
}).attach();

if (__DEV__) {
  if (module.hot) {
    module.hot.dispose(::styles.detach);
  }
}

export default class Root extends React.Component {
  render() {
    const { classes } = styles;

    return (
      <div className={classes.container}>
        <span className={classes.content}>
          Hello, browser!
        </span>
      </div>
    );
  }
}
