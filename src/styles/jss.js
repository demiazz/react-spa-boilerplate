import { create } from 'jss';
import prefixer from 'jss-vendor-prefixer';
import nested from 'jss-nested';
import camelCase from 'jss-camel-case';
import defaultUnit from 'jss-default-unit';
import isolate from 'jss-isolate';

import reset from './reset';


const jss = create();

// JSS plugins

jss.use(prefixer());
jss.use(nested());
jss.use(camelCase());
jss.use(defaultUnit({ unit: 'px' }));
jss.use(isolate({ reset }));


export { jss as default };
