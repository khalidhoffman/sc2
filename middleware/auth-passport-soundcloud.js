const passport = require('passport');

const config = require('../config');

const SoundCloudStrategy = require('passport-soundcloud').Strategy;
const soundCloudStrategyParams = {
    clientID: config.SOUNDCLOUD_CLIENT_ID,
    clientSecret: config.SOUNDCLOUD_CLIENT_SECRET,
    callbackURL: config.PUBLIC_URL
};


module.exports = function () {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    return new SoundCloudStrategy(soundCloudStrategyParams, function (accessToken, refreshToken, profile, done) {
        return done(null, Object.assign({accessToken}, profile));
    });
};
