/* eslint no-var: 0, no-console: 0 */

const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');

const utils = require('./utils');


const sourcePath = path.join(utils.sourceRoot, 'components');
const testPath = path.join(utils.testRoot, 'components');

function isComponentExists(component) {
  const filePath = path.join(sourcePath, `${component}.js`);
  const directoryPath = path.join(sourcePath, component);

  return utils.isFileExists(filePath) || utils.isFileExists(directoryPath);
}

function getDisplayName(component) {
  const kebabCaseName = _.last(component.split('/'));

  return _.upperFirst(_.camelCase(kebabCaseName));
}

function generateComponent(component, options) {
  const templateName = options.pure ? 'component/function' : 'component/class';
  const templateData = {
    name: getDisplayName(component),
    styles: options.styles,
  };

  var fileName;

  if (options.container) {
    fileName = `${component}/component.js`;
  } else if (options.styles) {
    fileName = `${component}/index.js`;
  } else {
    fileName = `${component}.js`;
  }

  const outputPath = path.join(sourcePath, fileName);

  utils.render(templateName, templateData, outputPath);
}

function generateComponentTest(component, options) {
  const templateName = 'component/component-test';
  const templateData = {
    name: getDisplayName(component),
    path: options.container ? `${component}/component` : component,
    relativePath: _.repeat('../', component.split('/').length - 1),
    module: component,
    styles: options.styles,
  };

  var fileName;

  if (options.container) {
    fileName = `${component}/component.js`;
  } else if (options.styles) {
    fileName = `${component}/index.js`;
  } else {
    fileName = `${component}.js`;
  }

  const outputPath = path.join(testPath, fileName);

  utils.render(templateName, templateData, outputPath);
}

function generateStyles(component) {
  const templateName = 'component/styles';
  const templateData = {
    relativePath: _.repeat('../', component.split('/').length - 1),
  };
  const outputPath = path.join(sourcePath, component, 'styles.js');

  utils.render(templateName, templateData, outputPath);
}

function generateStylesTest(component) {
  const templateName = 'component/styles-test';
  const templateData = {
    name: getDisplayName(component),
    module: component,
    relativePath: _.repeat('../', component.split('/').length - 1),
  };
  const outputPath = path.join(testPath, component, 'styles.js');

  utils.render(templateName, templateData, outputPath);
}

function generateContainer(component) {
  const templateName = 'component/container';
  const templateData = {
    name: getDisplayName(component),
  };
  const outputPath = path.join(sourcePath, component, 'index.js');

  utils.render(templateName, templateData, outputPath);
}

function generateContainerTest(component) {
  const templateName = 'component/container-test';
  const templateData = {
    module: component,
    relativePath: _.repeat('../', component.split('/').length - 1),
  };
  const outputPath = path.join(testPath, component, 'index.js');

  utils.render(templateName, templateData, outputPath);
}

function generate(component, options) {
  if (isComponentExists(component)) {
    console.error(chalk.red(`Error: Component ${component} already exists`));

    process.exit(1);
  }

  generateComponent(component, options);

  if (options.styles) {
    generateStyles(component);
  }

  if (options.container) {
    generateContainer(component);
  }

  if (!options.tests) {
    return;
  }

  generateComponentTest(component, options);

  if (options.styles) {
    generateStylesTest(component);
  }

  if (options.container) {
    generateContainerTest(component);
  }
}


module.exports = generate;
