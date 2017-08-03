import React from 'react';
import Hammer from 'hammerjs';
import {Sound as SCSound} from 'soundcloud-lib';
import {SortableElement} from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import {instance as app} from 'app';

class Sound extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    static get defaultProps() {
        return {
            artwork: 'https://placehold.it/500x500'
        };
    }

    static get propTypes() {
        return {
            artwork: PropTypes.string,
            sound: PropTypes.instanceOf(SCSound)
        };
    }

    onPan = (evt) => {
        if (!this.el) return;
        this.el.style = `z-index:100; transform: translate3d(${evt.deltaX}px, ${evt.deltaY}px, 0)`;
    }

    onBindNode = (node) => {
        if (!node) return;
        this.el = node;
        this.hammer = new Hammer(this.el);
        // this.hammer.on('pan', this.onPan);
    }

    componentWillUnmount() {
        if (this.hammer) this.hammer.destroy();
    }

    onClick = (proxyEvt, evt) => {
        this.props.onClick(this.props.sound, evt);
    }

    render() {
        const artWorkProps = {
            className: 'sound__artwork',
            style: {
                backgroundImage: `url('${this.props.sound.get('artwork_url') || this.props.artwork}'`
            }
        };

        return (
            <div className="sound" ref={this.onBindNode} onClick={this.onClick}>
                <div {...artWorkProps}/>
                <span className="sound__title">{this.props.sound.getTitle()}</span>
            </div>);
    }
}

export const SortableSound = SortableElement(props => (<Sound {...props}/>));

export default Sound;
