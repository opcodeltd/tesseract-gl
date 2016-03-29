/*global __dirname*/

var RemoveEmptyChunksPlugin = require('webpack/lib/optimize/RemoveEmptyChunksPlugin');
var OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
var webpack = require('webpack');

function devtoolFilenameTemplate(info) {
    if (info.resourcePath.match(/^\.\//)) {
        return 'webpack:///src/' + info.resourcePath.substr(1);
    }
    if (info.resourcePath.match(/^\/~\//)) {
        return 'webpack:///node_modules/' + info.resourcePath.substr(3);
    }
    console.log(info.resourcePath);
    return "webpack:///unknown/" + info.resourcePath;
}

module.exports = {
    context: __dirname + '/src',
    entry: {
        "tesseract-gl": "./tesseract-gl.js"
    },
    devtool: "#source-map",
    resolve: {
        root: __dirname + '/src',
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/},
        ],
    },
    output: {
        path: __dirname,
        library: ['TesseractGL'],
        filename: "[name].js",
        sourceMapFilename: "[name].js.map",
        devtoolModuleFilenameTemplate: devtoolFilenameTemplate,
        devtoolFallbackModuleFilenameTemplate: devtoolFilenameTemplate,
    },
    watchOptions: {
        poll: true
    },
    plugins: [
        new OccurrenceOrderPlugin(),
        new RemoveEmptyChunksPlugin()
    ],
};

