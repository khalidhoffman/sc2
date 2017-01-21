import {get} from 'lodash';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';


class Store {

    static compare(preVal, newVal, path) {
        return get(newVal, path) == get(preVal, path);
    }

    constructor(defaultState = {}) {
        this.state = defaultState;
        this.observable = new BehaviorSubject(this.state);
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

    on(path, callback) {
        return this.getObservable(path).subscribe({next: callback})
    }

    watch(path, callback) {
        return this.getStateObservable(path).subscribe({next: callback})
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