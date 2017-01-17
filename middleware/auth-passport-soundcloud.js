var url = require('url'),

    passport = require('passport'),

    SoundCloudStrategy = require('passport-soundcloud').Strategy,

    config = require('../config');


module.exports = function () {
    const callbackURL = config.DOMAIN_URL;

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    return new SoundCloudStrategy({
        clientID: config.SOUNDCLOUD_CLIENT_ID,
        clientSecret: config.SOUNDCLOUD_CLIENT_SECRET,
        callbackURL: callbackURL
    }, function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    });
};
