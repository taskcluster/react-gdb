import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import precss from 'precss'
import autoprefixer from 'autoprefixer'

// Configuration for building an example application.
// It builds two chunks: vendor chunk (node_modules stuff)
// and a bundle chunk (example, react-gdb, gdb-js).

function createExtract (path) {
  return new ExtractTextPlugin(path, { allChunks: true })
}

let extractReactGDB = createExtract('assets/react-gdb.css')
let extractExample = createExtract('assets/style.css')

export default {
  entry: ['source-map-support/register',
    'babel-polyfill', path.resolve('example/client.jsx')],

  output: {
    path: path.resolve('example/static/dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'source-map-loader',
      include: path.resolve('modules/gdb-js/lib')
    }, {
      test: /\.(js|jsx)$/,
      loader: 'babel',
      include: [path.resolve('example'), path.resolve('src')]
    }, {
      test: /\.css$/,
      loader: extractReactGDB.extract('style',
        'css?modules&importLoaders=1!postcss'),
      include: path.resolve('src')
    }, {
      test: /\.css$/,
      loader: extractExample.extract('style',
        'css?modules&importLoaders=1!postcss'),
      include: path.resolve('example')
    }, {
      // Avoid errors during build caused by `ws` package.
      test: /\/node_modules\/ws\//,
      loader: 'null'
    }]
  },

  plugins: [
    extractReactGDB,
    extractExample,
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js',
      (module) => /node_modules/.test(module.resource))
  ],

  resolve: {
    alias: {
      'react-gdb': path.resolve('src/index.jsx')
    },
    modulesDirectories: ['modules', 'node_modules']
  },

  node: {
    // Avoid errors during build caused by `source-map-support` package.
    fs: 'empty'
  },

  devtool: 'source-map',

  devServer: {
    contentBase: path.resolve('example/static'),
    port: process.env.PORT || 8080
  },

  watchOptions: {
    aggregateTimeout: 500
  },

  postcss: () => [precss, autoprefixer]
}

