var path = require("path");

module.exports = {
    output: {
        path: path.join(__dirname, "static" ),
        filename: "bundle.js",
        publicPath: '/static/'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: "babel?stage=0",
                exclude: /node_modules/,
            },
            {
                test: /\.css?$/,
                loader: 'style!css'
            }
        ],
    }
};
