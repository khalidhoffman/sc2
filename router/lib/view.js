const Router = require('./base');

class ViewRouter extends Router {

    toExpress() {

        /* GET home page. */
        this.router.get('/', this.auth.onAuth, this.auth.onAuthSuccess, (req, res) => {
            res.render("index", {
                title: "SoundCloud Manager"
            });
        });

        this.router.get('/auth/soundcloud/success', this.auth.onAuth, this.auth.onAuthSuccess);

        this.router.get('/login', this.passport.authenticate('soundcloud', {failureRedirect: '/'}), this.auth.onLogin);

        this.router.get('/logout', (req, res) => {
            req.logout();
            res.redirect('/');
        });

        return this.router;
    }
}

module.exports = ViewRouter;

