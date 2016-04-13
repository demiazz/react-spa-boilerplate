const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const values = require('lodash.values');

const config = require('./webpack.config');


// Configure output

config.output.filename = '[name]-[hash].min.js';

// Configure plugins

config.plugins.push(
  new ExtractTextPlugin('[name]-[hash].min.css')
);
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compressor: {
    warnings: false,
    screw_ie8: true,
  },
}));
config.plugins.push(
  new StatsPlugin('webpack.stats.json', {
    source: false,
    modules: false,
  })
);
config.plugins.push(
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  })
);

// Configure loaders

const cssLoader = config.module.loaders.css.loader;

config.module.loaders.css.loader = ExtractTextPlugin.extract(
  cssLoader[0], cssLoader.slice(1).join('!')
);

// Replace loaders

config.module.loaders = values(config.module.loaders);


module.exports = config;
