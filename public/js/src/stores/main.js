import {get, last} from 'lodash';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';


class Store {

    static compare(preVal, newVal, path) {
        return get(newVal, path) === get(preVal, path);
    }

    constructor(defaultState = {}) {
        this.state = defaultState;
        this.observable = new BehaviorSubject(this.state);
        this.subscriptions = {};
    }

    setState(state) {
        this.state = Object.assign({}, this.state, state);
        return this.observable.next(this.state);
    }

    getState() {
        return this.state;
    }

    get(path) {
        return get(this.state, path);
    }

    subscribe(callback) {
        this.observable.subscribe({next: callback});
    }

    /**
     * Passes the changed value on state changes
     * @param path
     * @param callback
     */
    on(path, callback) {
        const observable = this.getObservable(path).subscribe({next: callback});

        this.subscriptions[path] = this.subscriptions[path] || {callbacks: [], observables: []};
        this.subscriptions[path].callbacks.push(callback);
        this.subscriptions[path].observables.push(observable);

        return last(this.subscriptions[path].observables);
    }

    /**
     * Passes the changed value on state changes
     * @param path
     * @param callback
     */
    off(path, callback) {
        const callbackIdx = this.subscriptions[path].callbacks.indexOf(callback);
        let removedObservables;

        if (callbackIdx < 0) {
            console.warn('failed to unsubscribe');
            return;
        }

        this.subscriptions[path].callbacks.splice(callbackIdx, 1);
        removedObservables = this.subscriptions[path].observables.splice(callbackIdx, 1);
        removedObservables.forEach(observable => observable.unsubscribe());
    }

    /**
     * Passes the entire state on state changes
     * @param path
     * @param callback
     */
    watch(path, callback) {
        return this.getStateObservable(path).subscribe({next: callback});
    }

    getStateObservable(path) {
        return path
            ?
            this.observable.distinctUntilChanged((prev, state) => Store.compare(prev, state, path))
            :
            this.observable;
    }

    getObservable(path) {
        return this.getStateObservable(path).map(state => get(state, path));
    }
}

module.exports = Store;
