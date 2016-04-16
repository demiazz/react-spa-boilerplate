import { create } from 'jss';
import prefixer from 'jss-vendor-prefixer';
import nested from 'jss-nested';
import camelCase from 'jss-camel-case';
import isolate from 'jss-isolate';
import react from 'react-jss';

import reset from './reset';


const jss = create();

// JSS plugins

jss.use(prefixer());
jss.use(nested());
jss.use(camelCase());
jss.use(isolate({ reset }));

// Wrap JSS with React plugin

const useSheet = react(jss);


export { jss };
export { useSheet };
