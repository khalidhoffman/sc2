import React from "react";
import ReactDOM from "react-dom";

import Router from './router';
import Store from 'stores/main';
import APIController from 'controllers/api-controller';
import NotificationController from 'controllers/notification-controller';
import UIController from 'controllers/ui-controller';
import MainView from "views/main";

class App {
    constructor() {
        const defaults = {
            title: 'Hello World',
            searchText: '',
            user: {},
            userPlayLists: [],
            cachedPlayLists: [],
            messages: []
        };
        this.router = new Router();
        this.store = new Store(defaults);
        this.api = new APIController(this);
        this.notifications = new NotificationController(this);
        this.ui = new UIController(this);
    }

    render(DOMNode){
        ReactDOM.render(<MainView app={this}/>, DOMNode);
    }
}

export const instance = new App();
instance.render(document.getElementById('root'));
export default App;
