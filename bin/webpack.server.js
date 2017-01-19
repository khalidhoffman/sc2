const path = require('path'),

    webpack = require('webpack'),
    WebpackServer = require('webpack-dev-server'),

    SoundCloudServer = require('../'),

    config = require('../config'),
    webpackConfig = require('../public/js/src/webpack.config');

webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:4444/', 'webpack/hot/only-dev-server');

const server = new WebpackServer(webpack(webpackConfig), {
    quiet: false,
    noInfo: false,
    contentBase: config.PUBLIC_URL,
    hot: true,
    filename: path.join(process.cwd(), '/public/js/app.js'),
    setup: function (app) {
        return new SoundCloudServer(app).toNativeServer();
    },
    publicPath: "/public/js/app/src/",
    stats: {colors: true}
});

server.listen(config.PORT, config.DOMAIN, () => {
    console.log(`webpack is listening to ${config.DOMAIN}:${config.PORT}`);
});
