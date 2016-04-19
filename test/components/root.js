import React from 'react';
import { shallow } from 'enzyme';

import Root from '../../src/components/root';
import { styleSheet } from '../../src/components/root';


describe('components/root', () => {
  it('has wrapper with class `.root`', () => {
    const root = styleSheet.classes.root;
    const wrapper = shallow(<Root />);

    expect(wrapper).to.have.descendants(`.${root}`);
  });

  it('has `Hello, browser!` text', () => {
    const root = styleSheet.classes.root;
    const wrapper = shallow(<Root />);

    expect(wrapper.find(`.${root}`)).to.have.text('Hello, browser!');
  });
});
