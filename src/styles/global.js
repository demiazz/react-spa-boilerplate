import jss from './jss';


const styles = jss.createStyleSheet({
  // Write here your global styles
}, { named: false, isolate: false }).attach();


if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.dispose(::styles.detach);
  }
}
