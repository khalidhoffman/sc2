import React from 'react'
import {SortableSound} from './sound'

import {SortableContainer} from 'react-sortable-hoc';

class PlayList extends React.Component {
    constructor(props) {
        super(props);
        const scopedMethods = [
            //events
        ];
        for (const method of scopedMethods) {
            this[method] = this[method].bind(this);
        }
    }

    render() {
        return (<div className="playList">
            {this.props.playList.getSounds().map(function (sound, idx) {
                return (<SortableSound key={sound.getId() + idx} index={idx} sound={sound}/>)
            })}
        </div>)
    }
}

export const SortablePlayList = SortableContainer(props => (<PlayList playList={props.playList}/>));

export default PlayList;
