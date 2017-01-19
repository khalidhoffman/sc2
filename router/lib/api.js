const Router = require('./base');

class APIRouter extends Router {

    constructor(authController, soundCloudController){
        super(authController);
        this.soundcloud = soundCloudController;
    }

    toExpress() {

        this.router.get('/user',
            this.auth.verify(),
            this.soundcloud.onFetchUser());

        this.router.get('/playlists',
            this.auth.verify(),
            this.soundcloud.onFetchPlayLists());

        this.router.post('/playlist',
            this.auth.verify(),
            this.soundcloud.onUpdatePlayList());

        this.router.post('/query/playlist',
            this.auth.verify(),
            this.soundcloud.onFetchPlayList());

        return this.router;
    }
}

module.exports = APIRouter;
