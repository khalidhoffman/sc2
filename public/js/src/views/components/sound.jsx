import React from 'react';
import Hammer from 'hammerjs';

import {SortableElement} from 'react-sortable-hoc';

class Sound extends React.Component {
    static get defaultProps() {
        return {
            artwork: 'https://placehold.it/500x500'
        }
    };

    constructor(props) {
        super(props);

        const scopedMethods = [
            'onPan',
            'onBindNode'
        ];
        for (const method of scopedMethods) {
            this[method] = this[method].bind(this);
        }
    }

    onPan(evt) {
        if (!this.el) return;
        this.el.style = `z-index:100; transform: translate3d(${evt.deltaX}px, ${evt.deltaY}px, 0)`;
    }

    onBindNode(node) {
        if (!node) return;
        this.el = node;
        this.hammer = new Hammer(this.el);
        // this.hammer.on('pan', this.onPan);
    }

    componentWillUnmount() {
        if (this.hammer) this.hammer.destroy();
    }

    render() {
        return (<div className="sound" ref={this.onBindNode}>
            <div className='sound__artwork'
                 style={{backgroundImage: `url('${this.props.sound.get('artwork_url') || this.props.artwork}'`}}/>
            <span className="sound__title">{this.props.sound.getTitle()}</span>
        </div>)
    }
}

export const SortableSound = SortableElement((props) => (<Sound sound={props.sound}/>));

export default Sound;
