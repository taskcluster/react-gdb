var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('./node_modules').filter(function (x) {
  return ['.bin'].indexOf(x)===-1;
}).forEach(function (mod) {
  nodeModules[mod] = 'commonjs '+ mod;
});

module.exports = {
  entry: ['babel-polyfill','./src/dev-server.js','./src/client/index.jsx'],
  target: 'node',
  output: {
    path: path.join(__dirname,'lib'),
    filename: 'dev-server.js'
  },
  externals: nodeModules,
  module: {
    loaders:[
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        include: path.resolve(__dirname,"src"),
        query:{
          presets:["es2015","stage-1","react"],
          plugins: [
            'transform-regenerator',
            'syntax-async-functions',
            'transform-runtime'
          ]
        }
      }
    ]
  }
}
