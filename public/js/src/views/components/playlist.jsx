import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {find, reduce, sortBy, isString} from 'lodash';
import {arrayMove} from 'react-sortable-hoc';
import {instance as app} from 'app';
import {SoundCollection} from 'soundcloud-lib';
import {SortableSound} from './sound';
import MediaControls from './playlist-media-controls';


import {SortableContainer} from 'react-sortable-hoc';

class Playlist extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            sortMethod: 'default'
        };
    }

    static get propTypes() {
        return {
            playlist: PropTypes.instanceOf(SoundCollection),
            sortMethods: PropTypes.array,
            onSortChange: PropTypes.func,
            onSoundToggled: PropTypes.func
        };
    }

    static get defaultProps() {
        return {
            sortMethods: []
        };
    }

    onSortMethodChange = (sortMethod) => {
        this.setState({sortMethod});
    }

    onPlaylistSortSelected = (evt, index) => {
        // TODO probably shouldn't edit activePlaylist in state
        const sortKey = this.state.sortMethods[index] && this.state.sortMethods[index].val;
        const sortedSounds = sortBy(this.props.playlist.getSounds(), [sound => {
            const sortVal = sound.get(sortKey);
            if (isString(sortVal)) {
                return sortVal.replace(/[^a-z0-9]/ig, '');
            }
            return sortVal;
        }]);
        const updatedPlaylist = new SoundCollection(this.props.playlist.toJSON());

        updatedPlaylist.setSounds(sortedSounds);
        app.store.setState({
            activePlaylist: updatedPlaylist,
            sortMethod: sortKey
        });
        app.api.updatePlaylist(this.props.playlist)
            .then(() => app.notifications.queue(`Updated '${this.props.playlist.getTitle()}'`))
            .catch((err) => {
                switch (err.code) {
                    case 413:
                        app.notifications.queue('Playlist too large to update');
                        break;
                    default:
                        app.notifications.queue(`Failed to update '${this.props.playlist.getTitle()}'`);
                        break;
                }
            });

    }


    onSoundToggled = (toggledSound) => {
        const currentSound = app.media.getActiveSound('activeSound');

        app.media.setActiveSound(toggledSound);

        if (!currentSound || (currentSound && currentSound.getId() !== toggledSound.getId())) {
            app.store.setState({isPlaying: true});
        } else {
            app.media.togglePlayState();
        }
    }

    onActiveSoundChange = (activeSound) => {
        this.setState({activeSound});
    }

    onPlayStateChange = (isPlaying) => {
        this.setState({isPlaying});
    }

    componentDidMount = () => {
        app.store.on('sortMethod', this.onSortMethodChange);
        app.store.on('activeSound', this.onActiveSoundChange);
        app.store.on('isPlaying', this.onPlayStateChange);

        if (this.props.playlist) {
            // TODO filter setState calls for when necessary
            this.setState({
                sortMethods: reduce(this.props.playlist.getSounds(), (collection, sound) => {
                    Object.keys(sound.getMeta()).forEach(soundMetaPropName => {
                        if (find(collection, {val: soundMetaPropName})) return;
                        collection.push({
                            val: soundMetaPropName,
                            label: soundMetaPropName
                        });

                    });
                    return collection;
                }, [])
            });
        }
    }

    componentWillUnmount = () => {
        app.store.off('sortMethod', this.onSortMethodChange);
        app.store.off('activeSound', this.onActiveSoundChange);
        app.store.off('isPlaying', this.onPlayStateChange);
    }


    render() {
        const DropDownMenu = () => {
            const selectFieldProps = {
                floatingLabelText: 'sort by',
                onChange: this.onPlaylistSortSelected,
                value: this.state.sortMethod,
                style: {
                    height: 56,
                    verticalAlign: 'top'
                },
                floatingLabelStyle: {
                    top: 22
                },
                hintStyle: {
                    transform: 'scale(0.75) translate(0px, -40px)'
                },
                menuStyle: {
                    marginTop: 0
                }
            };
            const dropdownBackgroundProps = {
                zDepth: 1,
                className: classNames({
                    'playlist__sort': true
                }),
                style: {
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)'
                }
            };
            const sortMethods = this.state.sortMethods || this.props.sortMethods;
            const sortMethodMenuItems = sortMethods.map((method, idx) => {
                const menuItemProps = {
                    key: idx,
                    value: method.val,
                    primaryText: method.label || method.val
                };
                return (<MenuItem {...menuItemProps}/>);
            });

            return (
                <Paper {...dropdownBackgroundProps}>
                    <SelectField {...selectFieldProps}>
                        {sortMethodMenuItems}
                    </SelectField>
                </Paper>);
        };
        const sounds = this.props.playlist.getSounds().map((sound, idx) => {
            const soundProps = {
                key: `${sound.getId()}-${idx}`,
                index: idx,
                sound: sound,
                onClick: this.onSoundToggled
            };
            return (<SortableSound {...soundProps} />);
        });
        const mediaControlsProps = {
            onPlayButtonToggled: app.media.togglePlayState,
            isPlaying: this.state.isPlaying,
            sound: this.state.activeSound
        };

        return (
            <div className="playlist">
                <DropDownMenu/>
                <div className="playlist__sounds">
                    {sounds}
                </div>
                {mediaControlsProps.sound ? <MediaControls {...mediaControlsProps}/> : null}
            </div>);
    }
}

export const SortablePlaylist = SortableContainer(props => {
    const onSortEnd = ({prevIndex, newIndex}) => {
        if (prevIndex === newIndex) return; // order was not changed
        const activePlaylist = app.store.get('activePlaylist');

        app.media.setPlaylistSounds(arrayMove(activePlaylist.getSounds(), prevIndex, newIndex));
        app.api.updatePlaylist(this.state.activePlaylist)
            .then(() => {
                app.notifications.queue(`Updated '${this.state.activePlaylist.getTitle()}'`);
            })
            .catch((err) => {
                switch (err.code) {
                    case 413:
                        app.notifications.queue('Playlist too large to update');
                        break;
                    default:
                        app.notifications.queue(`Failed to update '${this.state.activePlaylist.getTitle()}'`);
                        break;
                }
            });
    };
    const mergedProps = Object.assign({}, props, {onSortEnd});

    return (<Playlist {...mergedProps}/>);
});

export default Playlist;
