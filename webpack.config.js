var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './index',
  devtool: 'cheap-module-eval-source-map',
  output: { path: __dirname, filename: 'bundle.js' },
  plugins: [
    new webpack.ProvidePlugin({ 'React': 'react'})
  ],
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};
