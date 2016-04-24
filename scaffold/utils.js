const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const mkdirp = require('mkdirp').sync;


const templatesRoot = path.join(__dirname, 'templates');
const sourceRoot = path.join(__dirname, '..', 'src');
const testRoot = path.join(__dirname, '..', 'test');

function isFileExists(filePath) {
  try {
    fs.statSync(filePath);

    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}

function render(templateName, data, outputPath) {
  const templatePath = path.join(templatesRoot, `${templateName}.mst`);
  const template = fs.readFileSync(templatePath).toString();
  const content = Mustache.render(template, data);

  mkdirp(path.dirname(outputPath));

  return fs.writeFileSync(outputPath, content);
}


module.exports = { templatesRoot, sourceRoot, testRoot, render, isFileExists };
