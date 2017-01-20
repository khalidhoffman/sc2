import Controller from './base-controller';

class UIController extends Controller {
    constructor(){
        super(...arguments);

        const scopedMethods = [
            'onSearch'
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
}

module.exports = UIController;
