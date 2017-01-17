const passport = require('passport');

class AuthController {
    constructor() {
        this.passport = passport;
    }

    verify() {
        return function (req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            let authError = new Error("Not authenticated");
            authError.status = 401;
            res.locals.error = authError;
            next(authError);
        }
    }

    onLogin() {
        return (req, res, next) => {
            next(); // handled by passport
        }
    }

    onAuth() {
        return (req, res, next) => {
            if (req.query.code) {
                return this.passport.authenticate('soundcloud', {failureRedirect: '/'})(req, res, next);
            } else {
                next();
            }
        }
    }

    onAuthSuccess() {
        return (req, res, next) => {
            if (req.query.code) {
                return res.redirect('/');
            }
            next();
        }
    }
}

module.exports = AuthController;
