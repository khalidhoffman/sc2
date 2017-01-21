import React from 'react'
import {find} from 'lodash'
import {Component} from 'react'
import {interval} from 'rxjs/observable/interval'
import classNames from 'classnames'
import {arrayMove} from 'react-sortable-hoc';

import injectTapEventPlugin from 'react-tap-event-plugin'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import CircularProgress from 'material-ui/CircularProgress'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import {SoundCollection as PlayList} from 'soundcloud-lib'

import {instance as app} from '../app'

import Notification from './components/notification'
import SearchBar from './components/search-bar'
import AppBarMenu from './components/app-bar-menu'
import {SortablePlayList as SortablePlayListView} from './components/playlist'

class MainView extends Component {

    constructor(props) {
        super(props);
        injectTapEventPlugin();
        this.state = {
            playLists: [],
            isDrawerOpen: false,
            loadingQueue: 0
        };

        this.store = app.store;
        this.api = app.api;
        this.router = app.router;
        this.notifications = app.notifications;
        this.ui = app.ui;

        const scopedMethods = [

            // synchronous
            'filterVisibleSongs',
            'getView',
            'isBusy',

            // actions
            'setPlayList',
            'showLoading',
            'hideLoading',
            'toggleDrawer',

            //events
            'onSoundMoved',
            'onPlayListDrawerItemClick',
            'onDrawerEvent'
        ];
        for (var method of scopedMethods) {
            this[method] = this[method].bind(this);
        }

    }

    componentDidMount() {
        const self = this;
        this.store.on('activePlayList', activePlayList => {
            if (!activePlayList) return;
            this.setState({activePlayList})
        });
        this.store.on('userPlayLists', playLists => {
            if (!playLists) return;
            this.setState({playLists})
        });

        this.store.on('searchText', searchText => {
            this.setState({
                activePlayListName: searchText
            })
        });

        this.store.getObservable('searchText')
            .debounce(() => interval(1000))
            .subscribe(name => {
                if (!name) return;
                // TODO investigate why this scope is not of MainView Class
                const playList = find(self.store.get('cachedPlayLists'), playList => {
                    return playList.getTitle() == name;
                });
                if (playList) {
                    self.setPlayList(playList);
                } else {
                    self.notifications.queue("invalid playlist name");
                    setTimeout(() => {
                        console.log('resetting activePlayListName');
                        self.store.setState({
                            searchText: ''
                        });
                    }, 2000);
                }
            });

        this.showLoading()
            .then(this.api.fetchUserData)
            .then(this.api.fetchPlayLists)
            .then(this.hideLoading)
            .catch(err => {
                this.hideLoading();
                this.notifications.queue('Please sign in', err);
            });
    }

    /**
     *
     * @param {PlayList} playList
     */
    setPlayList(playList) {
        this.setState({
            activePlayList: playList
        })
    }

    isBusy() {
        return this.state.loadingQueue > 0
    }

    /**
     *
     * @param {String} [playListName]
     */
    filterVisibleSongs(playListName) {
        const playListData = find(this.state.playLists, (playList) => {
            return playList.get('title') === playListName;
        });
        return playListData ? playListData.getSounds() : [];
    }

    showLoading() {
        this.setState({
            loadingQueue: this.state.loadingQueue + 1
        });
        return Promise.resolve();
    }

    hideLoading() {
        this.setState({
            loadingQueue: this.state.loadingQueue - 1
        });
        return Promise.resolve();
    }

    toggleDrawer() {
        console.log('toggling drawer');
        this.setState({
            isDrawerOpen: !this.state.isDrawerOpen
        })
    }

    onDrawerEvent(currentDrawerState, event) {
        console.log('drawer event: %o', event);
        switch (event) {
            case 'clickaway':
            case 'escape':
                if (this.state.isDrawerOpen) {
                    this.toggleDrawer();
                }
                break;
            default:
                break;
        }
    }

    /**
     *
     * @param {SoundCollection} playList
     */
    onPlayListDrawerItemClick(playList) {
        console.log('setting activePlayList: %o', playList);
        this.store.setState({
            activePlayList: playList
        });
        this.toggleDrawer();
    }

    onSoundMoved({oldIndex, newIndex}) {
        // TODO probably shouldn't edit activePlayList in state
        this.state.activePlayList.setSounds(arrayMove(orderedPlaylist.getSounds(), oldIndex, newIndex));
        this.setPlayList(this.state.activePlayList);
        this.api.updatePlayList(this.state.activePlayList)
            .then(() => {
                this.notifications.queue(`Updated '${this.state.activePlayList.getTitle()}'`)
            })
            .catch((err) => {
                switch(err.code){
                    case 413:
                        this.notifications.queue('Playlist too large to update');
                        break;
                    default:
                        this.notifications.queue(`Failed to update '${this.state.activePlayList.getTitle()}'`);
                        break;
                }
            })
    }

    /**
     *
     * @param {String} viewName
     */
    getView(viewName) {
        switch (viewName) {
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
                if (this.state.activePlayList) {
                    return (<SortablePlayListView onSortEnd={this.onSoundMoved} playList={this.state.activePlayList}/>);
                } else {
                    return (<center><h3>Welcome</h3></center>)
                }
        }
    }

    render() {

        const HeaderDropDown = () => {
            return (<AppBarMenu actions={this.ui.getActions('header-dropdown')}/>)
        };

        const Header = () => {
            const headerStyles = {
                'position': 'fixed',
                'top': 0
            };
            return (
                <AppBar onLeftIconButtonTouchTap={this.toggleDrawer}
                        iconElementRight={<HeaderDropDown/>}
                        style={headerStyles}
                        title="SC2"/>);

        };

        const MainView = () => {
            let viewName = this.isBusy() ? 'loading' : 'default';
            return this.getView(viewName);
        };

        const DrawerItem = (props) => {
            return (<MenuItem {...props} >{props.title}</MenuItem>);
        };

        const SideDrawer = () => {
            return (
                <Drawer docked={false} open={this.state.isDrawerOpen} onRequestChange={this.onDrawerEvent}>
                    {this.state.playLists.map((playList, index) => {
                        const drawerItemProps = {
                            key: index,
                            onClick: () => this.onPlayListDrawerItemClick(playList),
                            title: playList.getTitle()
                        };
                        return (<DrawerItem {...drawerItemProps} />);
                    })}
                </Drawer>)
        };

        return (
            <MuiThemeProvider>
                <div>
                    <Header />
                    <SearchBar onSearch={this.ui.onSearch}/>
                    <MainView />
                    <SideDrawer/>
                    <Notification/>
                </div>
            </MuiThemeProvider>)
    }
}

export default MainView;
