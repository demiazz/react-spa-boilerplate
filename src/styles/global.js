import jss from './jss';


const styles = jss.createStyleSheet({
  /* Use this stylesheet for global styles */
}, { named: false, isolate: false }).attach();


if (__DEV__) {
  if (module.hot) {
    module.hot.dispose(::styles.detach);
  }
}
