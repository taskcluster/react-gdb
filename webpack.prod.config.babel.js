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
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style',
        'css?minimize&modules&importLoaders=1!postcss')
    }, {
      // Use this to exclude unneeded files from production build.
      // Make sure that the project works fine without these modules.
      test: [path.resolve('src/middleware/error.js')],
      loader: 'null'
    }]
  },

  externals: [nodeExternals(), nodeExternals({ modulesDir: 'modules' })],

  postcss: () => [precss, autoprefixer],

  devtool: 'source-map'
}

