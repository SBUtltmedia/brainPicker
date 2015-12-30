var webpack = require('webpack');
var baseConfig = require('./webpack.base.config');
var config = Object.create(baseConfig);

config.devtool = 'cheap-module-eval-source-map';

config.entry = [
    'webpack-dev-server/client?http://localhost:3000',
    //'webpack/hot/only-dev-server',
    './src/main'
];

module.exports = config;
