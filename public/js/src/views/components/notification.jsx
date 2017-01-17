import React from 'react'
import classNames from 'classnames'
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
            notificationDuration: 2500
        }
    }

    show(message) {
        this.setState({
            text: message,
            isVisible: true
        });
    }

    hide() {
        this.setState({
            isVisible: false
        })
    }

    isVisible() {
        return this.state.isVisible;
    }

    getType() {
        return this.state.type;
    }

    componentDidMount() {
        const self = this;
        this.notifications.onUnread(message => {
            debugger;
            if (!message) return;
            self.show(message);
            setTimeout(() => {
                self.hide();
                self.notifications.dismiss();
            }, self.props.notificationDuration);
        })
    }

    render() {
        const notificationClassNames = classNames({
            'notification': true,
            'notification--visible': this.isVisible(),
            [`notification--${this.getType()}`]: true
        });
        return (
            <div className={notificationClassNames}>
                <p>{this.state.text}</p>
            </div>
        )
    }
}
