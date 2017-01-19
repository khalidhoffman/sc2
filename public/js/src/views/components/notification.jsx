import React from 'react'
import classNames from 'classnames'
import Snackbar from 'material-ui/Snackbar';
import {instance as app} from 'app'

export default class Notification extends React.Component {

    constructor(props) {
        super(...arguments);
        this.state = {
            text: ':-)',
            isVisible: false,
            type: 'default'
        };
        this.store = app.store;
        this.notifications = app.notifications;
    }

    static get defaultProps() {
        return {
            notificationDuration: 2500,
            animationOutDuration: 400,
            animationInDuration: 400
        }
    }

    notifyUser(message) {
        return new Promise((resolve, reject) => {
            this.setState({
                text: message,
                isVisible: true
            });

            setTimeout(() => {
                this.hide()
                    .then(resolve, reject);
            }, this.props.notificationDuration);
        });

    }

    hide() {
        return new Promise((resolve, reject) => {
            this.setState({
                isVisible: false
            });

            setTimeout(() => {
                resolve();
            }, this.props.animationOutDuration)
        });

    }

    isVisible() {
        return this.state.isVisible;
    }

    getType() {
        return this.state.type;
    }

    componentDidMount() {
        this.notifications.onUnread(messages => {
            messages.reduce((messageQueue, message) => {
                    return messageQueue.then(() => {
                        return this.notifyUser(message)
                    });
                },
                Promise.resolve())
                .then(this.notifications.dismissAll);
        })
    }

    render() {
        return (<Snackbar open={this.state.isVisible} message={this.state.text} />);
    }
}
