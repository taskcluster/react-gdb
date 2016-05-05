import webpack from 'webpack'
import path from 'path'

let PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  context: path.join(__dirname, 'src'),

  entry: './index.js',

  output: {
    path: path.join(__dirname, 'static/dist'),
    filename: 'bundle.js'
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: PRODUCTION ? /node_modules\/(ws|debug|assert)\// : /node_modules\/(ws)\//,
      loader: 'null'
    }]
  },

  devtool: PRODUCTION ? 'source-map' : 'eval-source-maps',

  watchOptions: {
    aggregateTimeout: 100
  }
}
