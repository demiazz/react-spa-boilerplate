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
    // NOTE: provide `process.env.NODE_ENV` to browser environment. Useful
    //       for development and debug purposes.
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    // NOTE: generate index.html file from template. HtmlPlugin generate
    //       script in head without `defer` option by default. You can
    //       provide additional options which will be available in template.
    //       For example, you can have config for error tracking service, and
    //       provide them to templates.
    //       See example in `src/index.ejs`.
    //       For more information see documentation for HtmlPlugin.
    new HtmlPlugin({
      template: path.join(src, 'index.ejs'),
      inject: false,
      filename: 'index.html',
    }),
    // NOTE: load fetch polyfill by Github as global `fetch`. Useful for old
    //       browsers. Polyfill use native `fetch` if available.
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    // NOTE: define `__DEV__` constant. Some packages use them internally.
    //       For example, react-router use them for showing warnings when
    //       `__DEV__` is true.
    new webpack.DefinePlugin({
      __DEV__: !isProduction,
    }),
  ],

  resolve: {
    // NOTE: resolve `.jss` files as JS modules. It's contains just JS code,
    //       but used for providing JSS stylesheets. You can use `.js` for them
    //       instead.
    extensions: ['', '.js', '.jss'],
  },
};

// Output configuration

// NOTE: add hash prefix to filenames. Useful for cache reset between deploys.
config.output.filename = isProduction ? '[name]-[hash].js' : '[name].js';

// Development tools

// NOTE: generate full source maps for production environment. For example, you
//       can upload them to Sentry on deploy. But generation of source map
//       insufficient.
//       In development environment use eval code generation which have high
//       build and rebuild speed.
config.devtool = isProduction ? 'source-map' : 'eval';

if (!isProduction) {
  // NOTE: include comments with information about the modules. It's helpful for
  //       debug reasons.
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
  // NOTE: extract styles to different files. Reduce JS file size.
  config.plugins.push(
    new ExtractTextPlugin('[name]-[hash].css')
  );

  // NOTE: enable code minification with UglifyJS. Disable support IE8 and less.
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
      },
    })
  );

  // NOTE: optimize occurence order modules and chunks. Entry have higher
  //       priority.
  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(true)
  );

  // NOTE: enable gzip compression. Modern web-servers and browsers can load
  //       gzipped files.
  config.plugins.push(
    new CompressionPlugin({
      algorithm: 'zopfli',
    })
  );

  // NOTE: generate manifest based on build statistics. May be used with
  //       template engines (for example, if you use Rails, or Django).
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

// NOTE: webpack-dev-server config. Don't use compression. Listen `0.0.0.0`
//       address (you can view application from mobile devices in you network
//       or from browsers inside virtual machines).
//       History API fallback enabled by default for supporting of react-router.
//       `hot` and `inline` options not works, if setted in config. Sets them
//       in `package.json` as command line arguments.
config.devServer = {
  colors: true,
  compress: false,
  host: '0.0.0.0',
  port: 3000,
  historyApiFallback: true,
};


module.exports = config;
