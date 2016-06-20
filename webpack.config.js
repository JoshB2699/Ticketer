module.exports = {
    entry: "./src/app.jsx",
    output: {
        path: './public',
        filename: 'browser.bundle.js',
            publicPath: './public',
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
