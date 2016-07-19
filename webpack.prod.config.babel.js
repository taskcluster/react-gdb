import path from 'path'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import precss from 'precss'
import autoprefixer from 'autoprefixer'

// Configuration for building an npm package.
// It excludes all dependencies from the final bundle,
// put all static assets to the related folder and
// provides a CommonJS interface to consume it.

export default {
  entry: path.resolve('src/index.jsx'),

  output: {
    path: path.resolve('lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('assets/style.css', { allChunks: true }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('production')
    })
  ],

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
        'css?minimize&modules&importLoaders=1!postcss')
    }]
  },

  externals: [nodeExternals()],

  postcss: () => [precss, autoprefixer],

  devtool: 'source-map'
}

