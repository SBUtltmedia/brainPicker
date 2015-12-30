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
                exclude: /node_modules/
            },
            {
                test: /\.css?$/,
                exclude: /node_modules/,
                loader: 'style!css'
            },
            {
                test: /\.(png|jpe?g|gif)?$/,
                exclude: /node_modules/,
                loader: "url?limit=100000000"
            }
        ],
    }
};
