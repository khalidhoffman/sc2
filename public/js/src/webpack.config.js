const path = require('path');

const webpack = require('webpack');

const jsOutputDir = path.join(__dirname, '../dist');
const jsSrcDir = __dirname;
const npmDir = path.join(__dirname, '../../../node_modules');
const portNum = 4445;

module.exports = {
    context: __dirname,
    entry: {
        app: 'render'
    },
    output: {
        path: jsOutputDir,
        publicPath: `http://localhost:${portNum}/js/dist`,
        filename: "sc2.[name].js"
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx?$/,
                loaders: ['babel-loader?presets[]=es2017,presets[]=react'],
                include: [jsSrcDir]
            },
        ]
    },
    resolve: {
        modules: [jsSrcDir, npmDir],
        extensions: ['.js', '.jsx'],
        alias: {
            "livejs": "vendor/LiveJS/livejs",
            "app": "app"
        }
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress : {
        //         drop_console : true,
        //         drop_debugger : true
        //     }
        // }),
        new webpack.ProvidePlugin({React: 'react'}),
        new webpack.DefinePlugin({"global.GENTLY": false}),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module) {
                const context = module.context;
                return context && context.indexOf('node_modules') >= 0;
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    node: {
        __dirname: true,
        iconv: "empty",
        fs: "empty",
        path: true,
        url: true
    },
    devServer: {
        publicPath: `http://localhost:${portNum}/js/dist/`,
        color: true,
        compress: false,
        port: portNum,
        hot: true
    }
};
