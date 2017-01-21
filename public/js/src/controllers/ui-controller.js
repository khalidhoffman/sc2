import Controller from './base-controller';

class UIController extends Controller {
    constructor(){
        super(...arguments);

        const scopedMethods = [
            'onSearch',
            'getActions'
        ];
        for (const method of scopedMethods) {
            this[method] = this[method].bind(this);
        }
    }

    onSearch(searchText) {
        this.store.setState({
            searchText: searchText
        });
        if (searchText) {
            this.api.fetchPlayList(searchText)
                .then(playLists => {
                    if (!playLists[0]) return Promise.reject();
                    this.setState({
                        activePlayList: playLists[0]
                    })
                })
                .catch(() => {
                    this.notifications.queue(`Could not find '${searchText}'`);
                })
        }
    }

    /**
     *
     * @param {String} namespace
     */
    getActions(namespace) {
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
}

module.exports = UIController;
