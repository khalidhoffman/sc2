import {Observable} from 'rxjs';
import Controller from './base-controller';

class NotificationController extends Controller {
    constructor() {
        super(...arguments);

        this.state = {
            intervalId: null,
            messages: [],
            intervalEmitter: null
        };
    }

    queue = (text) => {
        const messages = this.store.get('messages').concat([text]);
        this.store.setState({messages});
    }

    dismissOldest = () => {
        this.store.setState({
            messages: this.store.get('messages').slice(1)
        });
    }

    dismissAll = () => {
        this.store.setState({
            messages: []
        });
    }

    onNotificationTick() {
        if (this.state.messages.length > 0) {
            this.state.intervalEmitter.next(this.state.messages);
        } else {
            clearInterval(this.state.intervalId);
            delete this.state.intervalId;
        }
    }

    onUnread = (callback) => {
        return this.store.getObservable('messages')
            .mergeMap(messages => {
                this.state.messages = messages;
                return Observable.create(intervalEmitter => {
                    this.state.intervalEmitter = intervalEmitter;
                    if (!this.state.intervalId) {
                        this.state.intervalId = setInterval(() => {
                            this.onNotificationTick();
                        }, 3000);
                    }
                    this.onNotificationTick();
                });
            })
            .subscribe(callback);
    }
}

export default NotificationController;