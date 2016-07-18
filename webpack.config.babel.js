import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import nodeExternals from 'webpack-node-externals'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import precss from 'precss'
import autoprefixer from 'autoprefixer'

// TODO: uglify assets (only in production mode!),
// optimize build time (CommonsChunk?), HappyPack

const PRODUCTION = process.env.NODE_ENV === 'production'

let defaultConfig = {
  plugins: [
    new webpack.NoErrorsPlugin()
  ],

  watchOptions: {
    aggregateTimeout: 100
  },

  module: {
    preLoaders: [{
      test: /\.json$/,
      loader: 'json'
    }],
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss')
    }]
  },

  postcss: () => [precss, autoprefixer],

  devtool: 'source-map' // PRODUCTION ? 'source-map' : 'eval'
}

let libConfig = merge.smart({
  context: path.resolve('src'),

  entry: ['babel-polyfill', './index.jsx'],

  output: {
    path: path.resolve('lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    // TODO: gdb-js sourcemaps
    /* preLoaders: [{
      test: /\.js$/,
      loader: 'source-map',
      include: path.resolve('gdb-js')
    }] */
  },

  externals: [nodeExternals()],

  plugins: [
    new ExtractTextPlugin('assets/style.css', { allChunks: true })
  ]
}, defaultConfig)

let exampleConfig = merge.smart({
  context: path.resolve('example'),

  entry: './client.jsx',

  output: {
    path: path.resolve('example/static/dist'),
    filename: 'bundle.js'
  },

  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'source-map',
      include: path.resolve('lib')
    }]
  },

  // XXX: it's a hack to avoid errors caused by
  // docker-exec-websocket-server which requires
  // server-side `ws` package in the client-side code
  // TODO: Send a PR.
  resolve: {
    alias: {
      'ws': 'empty-module'
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
}, defaultConfig)

export default process.env.CONFIG === 'lib' ? libConfig
  : process.env.CONFIG === 'example' ? exampleConfig : [libConfig, exampleConfig]

