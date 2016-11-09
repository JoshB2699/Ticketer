var path = require('path');

module.exports = {
    entry: "./src/app.jsx",
    output: {
        path: './server/public/webpack',
        filename: 'bundle.js',
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
