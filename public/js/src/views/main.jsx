import React, {PureComponent} from 'react';
import {find} from 'lodash';
import {interval} from 'rxjs/observable/interval';
import classNames from 'classnames';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {SoundCollection as Playlist} from 'soundcloud-lib';
import {instance as app} from '../app';
import NotificationView from './components/notification';
import {SortablePlaylist as SortablePlaylistView} from './components/playlist';
import Header from './components/header';


class MainView extends PureComponent {

    constructor(props) {
        super(props);
        injectTapEventPlugin();
        this.state = {
            playlists: [],
            loadingQueue: 0
        };
    }

    /**
     *
     * @param {Playlist} playlist
     */
    setPlaylist = (playlist) => {
        app.media.setPlaylist(playlist);
    }

    isBusy = () => {
        return this.state.loadingQueue > 0;
    }

    showLoading = () => {
        this.setState({
            loadingQueue: this.state.loadingQueue + 1
        });
        return Promise.resolve();
    }

    hideLoading = () => {
        this.setState({
            loadingQueue: this.state.loadingQueue - 1
        });
        return Promise.resolve();
    }

    onDrawerEvent = (currentDrawerState, event) => {
        switch (event) {
            case 'clickaway':
            case 'escape':
                if (app.ui.menu.isDrawerOpen()) {
                    app.ui.menu.toggleDrawer();
                }
                break;
            default:
                break;
        }
    }

    /**
     *
     * @param {SoundCollection} playlist
     */
    onPlaylistDrawerItemClick = (playlist) => {
        app.media.setPlaylist(playlist);
        app.ui.menu.toggleDrawer();
    }

    componentDidMount() {

        app.store.on('isDrawerOpen', isDrawerOpen => {
            this.setState({isDrawerOpen});
        });

        app.store.on('activePlaylist', activePlaylist => {
            if (!activePlaylist) return;
            this.setState({activePlaylist});
        });

        app.store.on('userPlaylists', playlists => {
            if (!playlists) return;
            this.setState({playlists});
        });

        app.store.on('searchText', searchText => {
            this.setState({
                activePlaylistName: searchText
            });
        });

        app.store.getObservable('searchText')
            .debounce(() => interval(1000))
            .subscribe(name => {
                if (!name) return;
                // TODO investigate why this scope is not of MainView Class
                const playlist = find(app.store.get('cachedPlaylists'), playlist => {
                    return playlist.getTitle() === name;
                });
                if (playlist) {
                    app.media.setPlaylist(playlist);
                } else {
                    app.notifications.queue("invalid playlist name");
                    setTimeout(() => {
                        app.store.setState({
                            searchText: ''
                        });
                    }, 2000);
                }
            });

        this.showLoading()
            .then(app.api.fetchUserData)
            .then(app.api.fetchPlaylists)
            .then(this.hideLoading)
            .catch(err => {
                this.hideLoading();
                app.notifications.queue('Please sign in', err);
            });
    }

    render() {
        const sideDrawerProps = {
            docked: false,
            className: classNames({
                'sidebar': true,
                'sidebar--playlists': true,
                'sidebar--side': true
            }),
            containerClassName: classNames({
                'sidebar__drawer': true,
            }),
            zDepth: 2,
            open: app.ui.menu.isDrawerOpen(),
            onRequestChange: this.onDrawerEvent,
            overlayStyle: {
                zIndex: 9
            },
            containerStyle: {
                zIndex: 10,
                paddingTop: '64px'
            }
        };
        const MainView = () => {
            const mainViewName = this.isBusy() ? 'loading' : 'default';

            switch (mainViewName) {
                case 'loading':
                case 'busy':
                    const loadingViewClass = classNames({
                        'loading-view': true,
                        'loading-view--active': this.isBusy()
                    });
                    return (
                        <div className={loadingViewClass}>
                            <CircularProgress size={80} thickness={5}/>
                        </div>);
                case 'list':
                default:
                    if (!this.state.activePlaylist) {
                        return <center><h3>Welcome</h3></center>;
                    }

                    const sortablePlaylistProps = {
                        onSortEnd: this.onSoundMoved,
                        pressDelay: 250,
                        playlist: this.state.activePlaylist
                    };

                    return <SortablePlaylistView {...sortablePlaylistProps}/>;
            }
        };
        const playlistMenuItems = this.state.playlists.map((playlist, index) => {
            const drawerItemProps = {
                onClick: () => this.onPlaylistDrawerItemClick(playlist),
                title: playlist.getTitle()
            };
            return (<MenuItem key={index} {...drawerItemProps}>{drawerItemProps.title}</MenuItem>);
        });

        return (
            <MuiThemeProvider>
                <div>
                    <Header/>
                    <Drawer {...sideDrawerProps} >
                        {playlistMenuItems}
                    </Drawer>
                    <MainView/>
                    <NotificationView/>
                </div>
            </MuiThemeProvider>);
    }
}

export default MainView;
