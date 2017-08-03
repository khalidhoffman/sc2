import React from "react";
import ReactDOM from "react-dom";

import Router from './router';
import Store from 'stores/main';
import APIController from 'controllers/api-controller';
import NotificationController from 'controllers/notification-controller';
import SearchController from 'controllers/search-controller';
import MenuController from 'controllers/menu-controller';
import MediaController from 'controllers/media-controller';
import MainView from "views/main";

class App {
    constructor() {
        const defaults = {
            title: 'Hello World',
            searchText: '',
            user: {},
            userPlaylists: [],
            cachedPlaylists: [],
            messages: []
        };
        this.router = new Router();
        this.store = new Store(defaults);
        this.api = new APIController(this);
        this.notifications = new NotificationController(this);
        this.ui = {
            search: new SearchController(this),
            menu: new MenuController(this)
        };
        this.media = new MediaController(this);
    }

    render(DOMNode) {
        ReactDOM.render(<MainView app={this}/>, DOMNode);
    }
}

export const instance = new App();
export default App;
