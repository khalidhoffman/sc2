const path = require('path'),
    url = require('url'),
    fs = require('fs'),

    jsOutputDir = path.join(process.cwd(), '/public/js/'),
    jsSrcDir = path.join(process.cwd(), '/public/js/src/'),
    npmDir = path.join(process.cwd(), '/node_modules/'),
    webpack = require('webpack');

module.exports = {
    entry: ["app.js"],
    context : __dirname,
    output: {
        path: jsOutputDir,
        filename: "sc2.js"
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx?$/,
                loaders: ['babel-loader?presets[]=es2015,presets[]=react'],
                include: [jsSrcDir]
            },
        ]
    },
    resolve: {
        root: jsSrcDir,
        modulesDirectories: [jsSrcDir, npmDir],
        extensions: ['', '.js', '.jsx'],
        alias: {
            //"soundcloud": path.join(nodejsDir, '/soundcloud/'),
            //"debuggable": path.join(nodejsDir, '/debuggable/'),
            "livejs": "vendor/LiveJS/livejs"
        }
    },
    resolveLoader: {
        root: jsSrcDir
    },
    shim: {
        "live": [],
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress : {
        //         drop_console : true,
        //         drop_debugger : true
        //     }
        // }),
        new webpack.ProvidePlugin({
            React: 'react'
        }),
        new webpack.DefinePlugin({"global.GENTLY": false})
    ],
    node: {
        __dirname: true,
        iconv: "empty",
        fs: "empty",
        path: true,
        url: true
    }
};
