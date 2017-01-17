const APIRouter = require('./api'),
    ViewRouter = require('./view'),

    SoundCloudController = require('../controllers/soundcloud'),
    AuthController = require('../controllers/auth');

class AppRouter {
    constructor() {
        this.authController = new AuthController();
        this.soundCloudController = new SoundCloudController();
        this.View = new ViewRouter(this.authController);
        this.API = new APIRouter(this.authController, this.soundCloudController);
    }
}
module.exports = AppRouter;
