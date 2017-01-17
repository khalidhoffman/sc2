import {Observable} from 'rxjs';
import Controller from './base-controller';

class NotificationController extends Controller {
    constructor() {
        super(...arguments);

        const scopedMethods = [
            'queue',
            'onUnread',
            'dismiss'
        ];
        for (const method of scopedMethods) {
            this[method] = this[method].bind(this);
        }
    }

    queue(text) {
        const messages = this.store.get('messages').concat([text]);
        this.store.setState({messages});
    }

    dismiss() {
        this.store.setState({
            messages: this.store.get('messages').slice(1)
        });
    }

    onUnread(callback) {
        Observable.interval(3000)
            .map(() => this.store.get('messages'))
            .skipWhile(messages => {
                debugger;
                return messages.length < 1
            })
            .map(messages => messages[0])
            .subscribe(callback);
    }
}

module.exports = NotificationController;