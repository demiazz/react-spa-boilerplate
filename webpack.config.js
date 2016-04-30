const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');


// Environment

const isProduction = process.env.NODE_ENV === 'production';

// Paths

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

// Base configuration

const config = {
  entry: path.join(src, 'index.js'),

  output: {
    path: dist,
    publicPath: '/',
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlPlugin({
      template: path.join(src, 'index.ejs'),
      inject: false,
      filename: 'index.html',
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};

// Output configuration

config.output.filename = isProduction ? '[name]-[hash].js' : '[name].js';

// Development tools

config.devtool = isProduction ? 'source-map' : 'eval';

if (!isProduction) {
  config.output.pathinfo = true;
}

// CSS loader

const cssLoader = {
  test: /\.css$/,
};
const cssLoaders = ['css-loader', 'postcss-loader'];

if (isProduction) {
  cssLoader.loader = ExtractTextPlugin.extract('style-loader', cssLoaders);
} else {
  cssLoader.loaders = ['style-loader'].concat(cssLoaders);
}

config.module.loaders.push(cssLoader);

// PostCSS

const postcssPlugins = [autoprefixer];

if (isProduction) {
  postcssPlugins.push(cssnano);
}

config.postcss = postcssPlugins;

// Plugins

if (isProduction) {
  config.plugins.push(
    new ExtractTextPlugin('[name]-[hash].css')
  );

  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
      },
    })
  );

  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin()
  );

  config.plugins.push(
    new StatsPlugin('manifest.json', {
      chunkModules: false,
      source: false,
      chunks: false,
      modules: false,
      assets: true,
    })
  );
} else {
  config.plugins.push(
    new webpack.NoErrorsPlugin()
  );

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

// Development server

config.devServer = {
  colors: true,
  compress: false,
  host: '0.0.0.0',
  port: 3000,
  inline: true,
  historyApiFallback: true,
};


module.exports = config;
