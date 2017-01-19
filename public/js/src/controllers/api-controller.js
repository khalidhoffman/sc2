import $ from 'jquery';
import {find} from 'lodash';

import {SoundCollection as PlayList} from 'soundcloud'

import Controller from './base-controller';

class APIController extends Controller {

    constructor() {
        super(...arguments);

        const scopedMethods = [
            'fetchUserData',
            'fetchPlayLists',
            'fetchPlayList'
        ];
        for (const method of scopedMethods) {
            this[method] = this[method].bind(this);
        }
    }

    fetchUserData() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'GET',
                url: '/api/user',
                dataType: 'json',
                complete: (res) => {
                    if (res.status < 400) {
                        const userMeta = res.responseJSON;
                        this.store.setState({
                            user: userMeta
                        });
                        resolve(userMeta)
                    } else {
                        const err = new Error(`server responded with: ${res.status}`);
                        console.error(err);
                        reject(err);
                    }
                }
            });
        });

    }

    fetchPlayLists() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'GET',
                url: '/api/playlists',
                dataType: 'json',
                complete: res => {
                    if (res.status < 400) {
                        const userPlaylists = res.responseJSON.map(playlistMeta => {
                            return new PlayList(playlistMeta)
                        });
                        this.store.setState({
                            cachedPlayLists: this.store.get('cachedPlayLists').concat(userPlaylists),
                            userPlayLists: userPlaylists
                        });
                        resolve(userPlaylists);
                    } else {
                        const err = new Error(`server responded with: ${res.status}`);
                        console.error(err);
                        reject(err);
                    }
                }
            });
        });
    }

    /**
     *
     * @param {String} [playListName]
     */
    fetchPlayList(playListName) {
        return new Promise((resolve, reject) => {
            const cachedPlayList = find(this.store.get('cachedPlayLists'), (playListMeta) => {
                return playListName == playListMeta.title
            });
            if (cachedPlayList) {
                resolve(cachedPlayList);
            } else {
                $.ajax({
                    method: 'POST',
                    url: '/api/query/playlist',
                    body: JSON.stringify({
                        title: playListName
                    }),
                    dataType: 'json',
                    complete: (res) => {
                        if (res.status < 400) {
                            const queriedPlayList = new PlayList(res.responseJSON);
                            this.store.setState({
                                cachedPlayLists: this.store.get('cachedPlayLists').concat([queriedPlayList])
                            });
                            resolve(queriedPlayList);
                        } else {
                            const err = new Error(`server responded with: ${res.status}`);
                            console.error(err);
                            reject(err);
                        }
                    }
                })
            }
        });
    }

    /**
     *
     * @param {SoundCollection} playList
     */
    updatePlayList(playList) {
        return new Promise((resolve, reject) => {
            debugger;
            $.ajax({
                method: 'POST',
                url: '/api/playlist',
                data: playList.toJSON(),
                dataType: 'json',
                complete: (res) => {
                    debugger;
                    if (res.status < 400) {
                        console.log('set playlist %o', res.responseJSON);
                        resolve();
                    } else {
                        const err = new Error(`server responded with: ${res.status}`);
                        console.error(err);
                        reject(err);
                    }
                }
            });
        });
    }

    isLoggedIn() {
        return !!this.store.get('user.id');
    }
}

module.exports = APIController;
