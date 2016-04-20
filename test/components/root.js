import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

import Root from '../../src/components/root';
import { styleSheet } from '../../src/components/root';


test('has wrapper with class `.root`', t => {
  const root = styleSheet.classes.root;
  const wrapper = shallow(<Root />);

  t.is(wrapper.find(`.${root}`).length, 1);
});

test('has `Hello, browser!` text', t => {
  const root = styleSheet.classes.root;
  const wrapper = shallow(<Root />);

  t.is(wrapper.find(`.${root}`).text(), 'Hello, browser!');
});
