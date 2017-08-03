import React from 'react';
import IconButton from 'material-ui/IconButton';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import PauseIcon from 'material-ui/svg-icons/av/pause';
import PropTypes from 'prop-types';
import {instance as app} from '../../app';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import SoundMeta from './sound-meta';
import {Sound} from 'soundcloud-lib';

class MediaControl extends React.Component {
    constructor() {
        super(...arguments);

        this.store = app.store;
    }

    static get propTypes() {
        return {
            isPlaying: PropTypes.bool,
            onPlayButtonToggled: PropTypes.func,
            sound: PropTypes.instanceOf(Sound)
        };
    }

    isPlaying = () => {
        // return this.store.get('isPlaying');
        return this.props.isPlaying;
    }

    render() {
        const toolBarProps = {
            style: {
                zIndex: 2,
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0
            }
        };

        const playButtonProps = {
            touch: true,
            onClick: this.props.onPlayButtonToggled,
            children: this.isPlaying() ? <PauseIcon/> : <PlayIcon/>
        };

        const soundMetaProps = {
            albumArt: this.props.sound.get('artwork_url'),
            soundTitle: this.props.sound.get('title'),
            artistName: this.props.sound.get('artist')

        };

        return (
            <Toolbar {...toolBarProps}>
                <ToolbarGroup>
                    <IconButton {...playButtonProps} />
                </ToolbarGroup>
                <ToolbarGroup>
                    <SoundMeta {...soundMetaProps} />
                </ToolbarGroup>
            </Toolbar>);
    }
}

export default MediaControl;
