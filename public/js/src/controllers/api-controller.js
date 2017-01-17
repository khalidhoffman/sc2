import $ from 'jquery';
import {find} from 'lodash';

import {SoundCollection as PlayList} from 'soundcloud'

import Controller from './base-controller';

class APIController extends Controller {

    constructor(){
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
        var self = this;
        return new Promise((resolve, reject)=>{
            $.ajax({
                method: 'GET',
                url: '/api/user',
                complete: (res) => {
                    if (res.status < 400) {
                        const userMeta = res.responseJSON;
                        self.store.setState({
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
        var self = this;
        return new Promise((resolve, reject)=>{
            $.ajax({
                method: 'GET',
                url: '/api/playlists',
                complete: res => {
                    if (res.status < 400) {
                        const userPlaylists = res.responseJSON.map(playlistMeta => {
                            return new PlayList({meta: playlistMeta})
                        });
                        self.store.setState({
                            cachedPlayLists: self.store.get('cachedPlayLists').concat(userPlaylists),
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
        var self = this;
        return new Promise((resolve, reject)=>{
            const cachedPlayList = find(self.store.get('cachedPlayLists'), (playListMeta) => {
                return playListName == playListMeta.title
            });
            if (cachedPlayList) {
                resolve(cachedPlayList);
            } else {
                $.ajax({
                    method: 'POST',
                    url: '/api/query/playlist',
                    soundcloud: {
                        title: playListName
                    },
                    complete: (res) => {
                        if (res.status < 400) {
                            const queriedPlayList = new PlayList({meta: res.responseJSON});
                            self.store.setState({
                                cachedPlayLists: self.store.get('cachedPlayLists').concat([queriedPlayList])
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

    isLoggedIn() {
        return !!this.store.get('user.id');
    }
}

module.exports = APIController;
