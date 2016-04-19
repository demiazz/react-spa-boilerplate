const webpack = require('webpack');
const values = require('lodash.values');

const config = require('./webpack.config');


// Configure devtool

config.devtool = 'eval-source-map';

// Configure entry

config.entry.unshift('webpack-hot-middleware/client?reload=true');

// Configure output

config.output.filename = '[name].js';

// Configure plugins

config.plugins.push(
  new webpack.HotModuleReplacementPlugin()
);
config.plugins.push(
  new webpack.NoErrorsPlugin()
);

// Configure loaders

config.module.loaders.js.query.presets.push('react-hmre');
config.module.loaders.css.loader = config.module.loaders.css.loader.join('!');

// Replace loaders

config.module.loaders = values(config.module.loaders);


module.exports = config;
