import React from 'react';
import { mount } from 'enzyme';

import { jssClasses } from '../helpers/jss';

import Root from '../../src/components/root';


describe('<Root />', () => {
  it('has wrapper with .container class', () => {
    const wrapper = mount(<Root />);
    const classes = jssClasses(Root);

    return expect(wrapper.find(classes.container)).to.have.length(1);
  });

  it('has content with .content class', () => {
    const wrapper = mount(<Root />);
    const classes = jssClasses(Root);

    return expect(wrapper.find(classes.content)).to.have.length(1);
  });

  it('contains text `Hello, browser!`', () => {
    const wrapper = mount(<Root />);
    const classes = jssClasses(Root);

    return expect(wrapper.find(classes.content)).to.have.text('Hello, browser!');
  });
});
