var webpack = require('webpack');
var baseConfig = require('./webpack.base.config');
var config = Object.create(baseConfig);

config.devtool = 'cheap-module-eval-source-map';

module.exports = config;
