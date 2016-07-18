import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import nodeExternals from 'webpack-node-externals'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import precss from 'precss'
import autoprefixer from 'autoprefixer'
import HappyPack from 'happypack'

// TODO:
// optimize build time: HappyPack, webpack-dev-server, DLL

const PRODUCTION = process.env.NODE_ENV === 'production'

let threadPool = HappyPack.ThreadPool({ size: 4 })

let defaultConfig = {
  plugins: [
    new webpack.NoErrorsPlugin(),
    new HappyPack({
      id: 'styles',
      threadPool,
      loaders: [`css?${PRODUCTION ? 'minimize&' : ''}modules&importLoaders=1!postcss`]
    }),
    new HappyPack({
      id: 'scripts',
      threadPool,
      loaders: ['babel']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
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
      loader: 'happypack/loader?id=scripts',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'happypack/loader?id=styles'),
      exclude: /node_modules/
    }]
  },

  postcss: () => [precss, autoprefixer],

  devtool: 'source-map' // PRODUCTION ? 'source-map' : 'eval'
}

let libConfig = merge.smart({
  context: path.resolve('src'),

  entry: './index.jsx',

  output: {
    path: path.resolve('lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  externals: [nodeExternals()],

  plugins: [
    new ExtractTextPlugin('assets/style.css', { allChunks: true })
  ]
}, defaultConfig)

let exampleConfig = merge.smart({
  context: path.resolve('example'),

  entry: ['babel-polyfill', './client.jsx'],

  output: {
    path: path.resolve('example/static/dist'),
    filename: 'bundle.js'
  },

  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'source-map',
      include: [path.resolve('lib'), path.resolve('node_modules/gdb-js/lib')]
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

