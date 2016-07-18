import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import nodeExternals from 'webpack-node-externals'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import precss from 'precss'
import autoprefixer from 'autoprefixer'

const PRODUCTION = process.env.NODE_ENV === 'production'

let defaultConfig = {
  plugins: [
    new webpack.NoErrorsPlugin(),
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
      loader: ExtractTextPlugin.extract('style',
        `css?${PRODUCTION ? 'minimize&' : ''}modules&importLoaders=1!postcss`),
      exclude: /node_modules/
    }]
  },

  postcss: () => [precss, autoprefixer],

  devtool: 'source-map'
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

  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./example/dll-manifest.json')
    })
  ]
}, defaultConfig)

let dllConfig = {
  entry: {
    dll: ['babel-polyfill', 'react', 'react-dom', 'react-redux',
      'redux', 'immutable', 'docker-exec-websocket-server/browser',
      'react-immutable-proptypes', 'brace']
  },

  output: {
    path: path.resolve('example/static/dist'),
    filename: '[name].js',
    library: '[name]_[hash]'
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.resolve('example/[name]-manifest.json'),
      name: '[name]_[hash]'
    })
  ],

  // XXX: it's a hack to avoid errors caused by
  // docker-exec-websocket-server which requires
  // server-side `ws` package in the client-side code
  // TODO: Send a PR.
  resolve: {
    alias: {
      'ws': 'empty-module'
    }
  },
}

export default process.env.CONFIG === 'dll' ? dllConfig
  : process.env.CONFIG === 'lib' ? libConfig
  : process.env.CONFIG === 'example' ? exampleConfig
  : [libConfig, exampleConfig]

