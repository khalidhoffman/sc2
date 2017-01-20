class Controller{
    constructor(app){
        this.router = app.router;
        this.store = app.store;
        this.api = app.api;
        this.notifications = app.notifications;
    }


}

export default Controller;