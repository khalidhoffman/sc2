const path = require('path');
const http = require('http');

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const Router = require('./router');
const config = require('./config');

 // middleware
const soundcloudPassport = require('./middleware/auth-passport-soundcloud');
const onError = require('./middleware/on-error');
const on404 = require('./middleware/on-404');

class SoundCloudServer {

    /**
     *
     * @param {express} [parentApp] an express that SC2 will build on
     * @param {AppRouter} [router]
     */
    constructor(parentApp, router) {
        this.app = parentApp || express();
        this.passport = passport;
        this.router = router || new Router();
        this._init();
    }

    _init() {
        this.app.set('port', parseInt(config.PORT));
        this.app.set('env', 'development');

        // view engine setup
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'pug');

        this.app.use(logger('dev'));
        this.app.use(bodyParser.json({limit: '5mb'}));
        this.app.use(bodyParser.urlencoded({extended: true, limit: '5mb', parameterLimit: 10 * 1000}));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(process.cwd(), 'public')));

        this.app.use(session({
            secret: config.SERVER_SESSION_SECRET,
            resave: true,
            saveUninitialized: true
        }));

        this.passport.use(soundcloudPassport());
        this.app.use(this.passport.initialize());
        this.app.use(this.passport.session());

        this.app.use('/', this.router.View.toExpress());
        this.app.use('/api/', this.router.API.toExpress());

        // set error handlers
        this.app.use(on404());
        this.app.use(onError());
    }

    /**
     *
     * @returns {http.Server|Server|Function}
     */
    toNativeServer() {
        return http.createServer(this.app);
    }

    get (key){
        return this.app.get(key);
    }
}

module.exports = SoundCloudServer;
