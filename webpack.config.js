const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const autoprefixer = require('autoprefixer');


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

  module: {
    loaders: [
      {
        test: /\.jss?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlPlugin({
      template: path.join(src, 'index.ejs'),
      inject: false,
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    new webpack.DefinePlugin({
      __DEV__: !isProduction,
    }),
  ],

  resolve: {
    extensions: ['', '.js', '.jss'],
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
  // NOTE: process external `.css` files.
  test: /\.css$/,
};
const cssLoaders = [
  `css-loader?${JSON.stringify({
    // NOTE: don't need source maps on production. Error don't handles in
    //       styles. Source maps will be generated, but will be empty.
    sourceMap: !isProduction,
    // NOTE: minimize result code for production (`css-loader` uses `cssnano`).
    minimize: isProduction,
  })}`,
  // NOTE: use `defaults` pack of plugins for processing external styles.
  'postcss-loader',
];

if (isProduction) {
  // NOTE: extract styles to external file for production build.
  cssLoader.loader = ExtractTextPlugin.extract('style-loader', cssLoaders);
} else {
  cssLoader.loaders = ['style-loader'].concat(cssLoaders);
}

config.module.loaders.push(cssLoader);

// PostCSS loader

const pcssLoader = {
  test: /\.pcss$/,
};
const pcssLoaders = [
  `css-loader?${JSON.stringify({
    // NOTE: don't need source maps on production. Error don't handles in
    //       styles. Source maps will be generated, but will be empty.
    sourceMap: !isProduction,
    // NOTE: use CSS Modules.
    modules: true,
    // NOTE: use shorter style name in production, and more informative in
    //       development for debug purposes.
    localIdentName: isProduction
      ? '[hash:base64:4]'
      : '[name]__[local]___[hash:base64:3]',
    // NOTE: `camelCase` option used for export camel cased names to JS.
    camelCase: true,
    // NOTE: minimize result code for production (`css-loader` uses `cssnano`).
    minimize: isProduction,
  })}`,
  // NOTE: use `modules` pack for processing internal CSS modules files.
  'postcss-loader?pack=modules',
];

if (isProduction) {
  // NOTE: extract styles to external file for production build.
  pcssLoader.loader = ExtractTextPlugin.extract('style-loader', pcssLoaders);
} else {
  pcssLoader.loaders = ['style-loader'].concat(pcssLoaders);
}

config.module.loaders.push(pcssLoader);

// PostCSS

config.postcss = function postcssPacks() {
  return {
    // NOTE: PostCSS plugins for processing external CSS dependencies.
    defaults: [autoprefixer],
    // NOTE: PostCSS plugins for processing internal CSS modules.
    modules: [autoprefixer],
  };
};

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
    new CompressionPlugin()
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
}

// Development server

config.devServer = {
  colors: true,
  compress: false,
  host: '0.0.0.0',
  port: 3000,
  historyApiFallback: true,
};


module.exports = config;
