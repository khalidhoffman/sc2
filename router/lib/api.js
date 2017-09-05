const Router = require('./base');

class APIRouter extends Router {

    constructor(authController, soundCloudController) {
        super(authController);
        this.soundcloud = soundCloudController;
    }

    toExpress() {

        this.router.get('/auth/soundcloud/success', this.auth.onAuth, this.auth.onAuthSuccess);

        this.router.get('/user', this.auth.verify, this.soundcloud.getUserMeta);

        this.router.get('/stream', this.auth.verify, this.soundcloud.fetchStream);

        this.router.get('/playlists', this.auth.verify, this.soundcloud.fetchPlaylists);

        this.router.post('/playlist', this.auth.verify, this.soundcloud.updatePlaylist);

        this.router.post('/query/playlist', this.auth.verify, this.soundcloud.fetchPlaylist);

        return this.router;
    }
}

module.exports = APIRouter;
