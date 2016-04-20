import jss from './jss';


const styles = jss.createStyleSheet({
  // Write here your global styles
}, { named: false, isolate: false }).attach();


if (module.hot) {
  module.hot.dispose(::styles.detach);
}
