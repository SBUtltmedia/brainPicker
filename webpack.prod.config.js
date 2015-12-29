var webpack = require('webpack');
var baseConfig = require('./webpack.base.config');
var config = Object.create(baseConfig);

config.devtool = 'cheap-module-source-map';

config.entry = "./src/main";

config.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compressor: {
            screw_ie8: true,
            warnings: false
        }
    }),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
];

config.module.loaders.push({
    test: /\.(png|jpe?g|gif)?$/,
    loaders: [
        'url?limit=100000000',
        'image-webpack?bypassOnDebug&interlaced=false&optimizationLevel=0&speed=10&quality=10'
    ]
});

module.exports = config;
