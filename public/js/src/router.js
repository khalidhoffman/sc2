class Router {

    path(path) {
        location.href = path;
    }

    refresh(){
        location.reload();
    }

    showHelp() {
        console.log('show help');
    }

    login() {
        location.href = '/login'
    }

    logout() {
        location.href = '/logout'
    }
}

export default Router;

