import Controller from './base-controller';

class UIController extends Controller {
    constructor() {
        super(...arguments);
    }

    onSearch = (searchText) => {
        this.store.setState({
            searchText: searchText
        });
        if (searchText) {
            this.api.fetchPlaylist(searchText)
                .then(playlists => {
                    if (!playlists[0]) return Promise.reject();
                    this.setState({
                        activePlaylist: playlists[0]
                    });
                })
                .catch(() => {
                    this.notifications.queue(`Could not find '${searchText}'`);
                });
        }
    }

    /**
     *
     * @param {String} namespace
     */
    getActions = (namespace) => {
        switch (namespace) {
            case 'header-dropdown':
            case 'menu':
                return [
                    {
                        label: 'Help',
                        callback: this.router.showHelp
                    },
                    {
                        label: 'Refresh',
                        callback: this.router.refresh
                    },
                    {
                        label: (this.api.isLoggedIn()) ? 'Sign Out' : 'Sign In',
                        callback: (this.api.isLoggedIn()) ? this.router.logout : this.router.login
                    }
                ];

            default:
                return [];
        }
    }


    toggleDrawer = () => {
        this.store.setState({
            isDrawerOpen: !this.store.get('isDrawerOpen')
        });
    }

    isDrawerOpen = () => {
        return this.store.get('isDrawerOpen');
    }
}

export default UIController;
