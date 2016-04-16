import { create } from 'jss';
import prefixer from 'jss-vendor-prefixer';
import nested from 'jss-nested';
import camelCase from 'jss-camel-case';
import isolate from 'jss-isolate';
import react from 'react-jss';


const jss = create();

// JSS plugins

jss.use(prefixer());
jss.use(nested());
jss.use(camelCase());
jss.use(isolate());

// Wrap JSS with React plugin

const useSheet = react(jss);


export { jss };
export { useSheet };
