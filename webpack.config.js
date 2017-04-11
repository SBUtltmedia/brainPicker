var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './index',
  devtool: '#eval-cheap-module-source-map',
  output: { path: __dirname, filename: 'bundle.js' },
  plugins: [
    new webpack.ProvidePlugin({ 'React': 'react'})
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname,
        query: { 'presets': ['react', 'es2015', 'stage-0']}
      },{
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"]
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
};
