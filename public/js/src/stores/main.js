import {get} from 'lodash';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/exhaust';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

class Store {
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

    static compare(preVal, newVal, path){
        return get(newVal, path) == get(preVal, path);
    }

    on(path, callback) {
        return this.observable
            .distinctUntilChanged((prev, state) => Store.compare(prev, state, path))
            .map(state => get(state, path))
            .subscribe({next: callback})
    }

    watch(path, callback) {
        return this.observable
            .distinctUntilChanged((prev, state) => Store.compare(prev, state, path))
            .subscribe({next: callback})
    }

    listenTo(path, options, callback) {
        let filter;
        if (callback) {
            filter = (prev, state) => options.filter(get(state, path))
        } else {
            callback = options;
            filter = state => get(state, path);
        }
        this.observable
            .distinctUntilChanged(filter)
            .subscribe({next: callback})
    }

    getObservable(path) {
        return path
            ?
            this.observable.distinctUntilChanged((prev, state) => Store.compare(prev, state, path))
            :
            this.observable;
    }

    getReducedObservable(path){
        let reducedObservable;
        if (path){
            reducedObservable = this.observable
                                   .distinctUntilChanged((prev, state) => Store.compare(prev, state, path))
        } else {
            reducedObservable = this.observable;
        }

        return reducedObservable.map(state => get(state, path));
    }
}

module.exports = Store;