import webpack from 'webpack'
import path from 'path'

let PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = [{
  context: path.join(__dirname, 'example')

  entry: './client.jsx',

  output: {
    path: path.join(__dirname, 'example/static'),
    filename: 'bundle.js'
  },

  plugins: [
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /node_modules\/(react|ws)\//,
      loader: 'null'
    }]
  },

  devtool: 'eval-source-map',

  watchOptions: {
    aggregateTimeout: 100
  }
}, {
}]
