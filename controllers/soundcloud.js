const _ = require('lodash');
const SoundCloud = require('soundcloud-lib');
const request = require('superagent');

const config = require('../config');

class SoundCloudDataController {
    constructor() {
        this.userCache = [];
        this.userCacheMap = {};
        this.routeMethods = [
            'getUserMeta',
            'updatePlaylist',
            'fetchPlaylists',
            'fetchPlaylist'
        ];

        this.routeMethods.forEach(methodName => {
            this[methodName] = this[methodName].bind(this);
        });
    }

    findUserByRequest(req) {
        const userMeta = _.get(req, 'session.passport.user');

        let user = this.userCache[this.userCacheMap[userMeta.id]];

        if (!user) {
            user = new SoundCloud.User({
                clientId: config.SOUNDCLOUD_CLIENT_ID,
                accessToken: userMeta.accessToken,
                meta: userMeta._json
            });
            this.userCache.push(user);
            this.userCacheMap[userMeta.id] = this.userCache.length - 1;
        }

        return Promise.resolve(user);
    }

    getUserMeta(req, res, next) {
        this.findUserByRequest(req)
            .then(user => {
                return user.fetchUserMeta();
            })
            .then((meta) => {
                res.json(meta);
            })
            .catch(next);
    }

    /**
     *
     * @param {Object} playlistData
     */
    sanitizePlaylistData(playlistData) {
        return _.chain(playlistData)
            .pick([
                'kind',
                'title',
                'tracks',
                'user_id'
            ])
            .set('title', 'sc2_' + playlistData.title)
            .value();
    }

    updatePlaylist(req, res, next) {
        let playlistData = req.body;

        this.findUserByRequest(req)
            .then(user => {
                if (/^sc2_/.test(playlistData.title)) {
                    return user.setPlaylist(playlistData);
                }

                playlistData = this.sanitizePlaylistData(playlistData);
                return user.createPlaylist(playlistData);
            })
            .then((meta) => {
                res.json(meta);
            })
            .catch(next);
    }

    fetchPlaylists(req, res, next) {
        this.findUserByRequest(req)
            .then(user => {
                return user.getPlaylists();
            })
            .then((playlists) => {
                return res.json(playlists.map(playlist => playlist.toJSON()));
            })
            .catch(next);
    }

    fetchPlaylist(req, res, next) {
        this.findUserByRequest(req)
            .then(user => {
                return user.getPlaylists();
            })
            .then(playlists => {
                const playlistMatchRegex = new RegExp(req.body.title, 'i'),
                    matchedPlaylist = _.find(playlists, function (playlist) {
                        return playlist.getTitle().match(playlistMatchRegex);
                    });
                if (matchedPlaylist) {
                    return res.json(matchedPlaylist.toJSON());
                } else {
                    return Promise.reject(new Error("Playlist not listed"));
                }
            })
            .catch(next);
    }

    fetchStream(req, res, next) {
        res.set('Content-type', 'audio/mpeg');

        request.get(`${req.query.url}?client_id=${config.SOUNDCLOUD_CLIENT_ID}`)
            .on('error', next)
            .pipe(res);
    }
}

module.exports = SoundCloudDataController;
