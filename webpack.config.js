var path = require('path');

module.exports = {
    entry: "./src/app.jsx",
    output: {
        path: './public',
        filename: 'browser.bundle.js',
            publicPath: '/public',
    },

    devtool: 'source-map',

    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', query: {presets:['es2015','react']}},
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
};
