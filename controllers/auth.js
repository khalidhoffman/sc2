const passport = require('passport');

class AuthController {
    constructor() {
        this.passport = passport;
        this.routeMethods = [
            'verify',
            'onLogin',
            'onAuth',
            'onAuthSuccess'
        ];

        this.routeMethods.forEach(methodName => {
            this[methodName] = this[methodName].bind(this);
        });
    }

    verify(req, res, next) {
        let authError;

        if (req.isAuthenticated()) {
            next();
            return;
        }

        authError = new Error("Not authenticated");
        authError.status = 401;

        next(authError);
    }

    onLogin(req, res, next) {
        next(); // handled by passport
    }

    onAuth(req, res, next) {
        if (req.query.code) {
            this.passport.authenticate('soundcloud', {failureRedirect: '/'})(req, res, next);
        } else {
            next();
        }
    }

    onAuthSuccess(req, res, next) {
        if (req.query.code) {
            res.redirect('/');
            return;
        }
        next();
    }
}

module.exports = AuthController;
