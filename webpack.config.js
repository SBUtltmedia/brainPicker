var path = require("path");

module.exports = {
    entry: "./src/main",
    output: {
        path: path.join(__dirname, "dist" ),
        filename: "bundle.js",
    },
    watch: true,
    resolve: {
      extensions: ['', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: "babel-loader?stage=0",
                exclude: '/node_modules/',
            },
            {
                test: /\.css?$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.png?$/,
                loader: "url-loader?limit=10000"
            },
            {
                test: /\.gif?$/,
                loader: "url-loader?mimetype=image/png"
            },
            {
                test: /\.jpg?$/,
                loader: "url-loader?limit=10000"
            }
        ],
    },
    stats: {
        colors: true,
    },
    devtool: "source-map",
};
