var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve('./'),
  entry: './src/index',
  devtool: 'source-map',
  output: { path: __dirname, filename: 'bundle.js' },
  plugins: [
    new webpack.ProvidePlugin({ 'React': 'react'})
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },{
      test: /\.scss$/,
      loaders: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  resolve: {
    alias: {
      data: path.resolve('data'),
    }
  }
};
