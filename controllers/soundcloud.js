const _ = require('lodash'),

    SoundCloud = require('soundcloud-lib'),

    config = require('../config');

class SoundCloudDataController {
    constructor() {
        this.cache = {};
    }

    getUser(req) {
        const userMeta = req.session.passport.user;
        this.cache[userMeta.id] = this.cache[userMeta.id] || new SoundCloud.User({
                clientId: config.SOUNDCLOUD_CLIENT_ID,
                accessToken: userMeta.accessToken,
                meta: userMeta._json
            });

        return this.cache[userMeta.id];
    }

    onFetchUser() {
        const self = this;
        return function (req, res, next) {
            self.getUser(req)
                .fetchUserMeta()
                .then((meta) => {
                    res.json(meta)
                })
                .catch(next);
        }
    }

    onUpdatePlayList() {
        const self = this;
        return function (req, res, next) {
            self.getUser(req)
                .setPlayList(req.body)
                .then((meta) => {
                    res.json(meta)
                })
                .catch(next);
        }
    }

    onFetchPlayLists() {
        const self = this;
        return function (req, res, next) {

            self.getUser(req)
                .getPlayLists()
                .then((playLists) => {
                    return res.json(playLists.map(playList => playList.toJSON()));
                })
                .catch(next)
        }
    }

    onFetchPlayList() {
        const self = this;
        return function (req, res, next) {
            self.getUser(req)
                .getPlayLists()
                .then(playlists => {
                    const playListMatchRegex = new RegExp(req.body.title, 'i'),
                        matchedPlayList = _.find(playlists, function (playList) {
                            return playList.getTitle().match(playListMatchRegex);
                        });
                    if (matchedPlayList) {
                        return res.json(matchedPlayList.toJSON());
                    } else {
                        return Promise.reject(new Error("PlayList not listed"));
                    }
                })
                .catch(next)
        }
    }
}

module.exports = SoundCloudDataController;
