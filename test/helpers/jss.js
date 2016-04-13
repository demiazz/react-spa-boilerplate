import React from 'react';
import { shallow } from 'enzyme';


export function jssClasses(Component) {
  const wrapper = shallow(<Component />);
  const classes = wrapper.props().sheet.classes;
  const result = { };

  Object.keys(classes).forEach(key => result[key] = `.${classes[key]}`);

  return result;
}
