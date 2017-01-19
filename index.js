const path = require('path'),
    http = require('http'),

    express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),

    Router = require('./router'),
    config = require('./config'),

    // middleware
    soundcloudPassport = require('./middleware/auth-passport-soundcloud'),
    onError = require('./middleware/on-error'),
    on404 = require('./middleware/on-404');

class SoundCloudServer {

    constructor(childApp) {
        this.app = childApp || express();
        this.passport = passport;
        this.router = new Router();
        this.init();
    }

    init() {
        this.app.set('port', parseInt(config.PORT));
        this.app.set('env', 'development');

        // view engine setup
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'pug');

        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
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

    toNativeServer() {
        return http.createServer(this.app);
    }

    get (key){
        return this.app.get(key);
    }
}

module.exports = SoundCloudServer;
