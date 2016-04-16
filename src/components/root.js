import React from 'react';

import { useSheet, theme } from '../styles';


const styles = {
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
};

class Root extends React.Component {
  render() {
    const { classes } = this.props.sheet;

    return (
      <div className={classes.container}>
        <span className={classes.content}>
          Hello, browser!
        </span>
      </div>
    );
  }
}


export default useSheet(Root, styles);
