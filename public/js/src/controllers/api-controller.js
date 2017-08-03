import request from 'superagent';
import $ from 'jquery';
import {find} from 'lodash';

import {SoundCollection as Playlist} from 'soundcloud-lib';

import Controller from './base-controller';

class APIController extends Controller {

    constructor() {
        super(...arguments);
    }

    fetchUserData = () => {
        return request.get('/api/user')
            .then(response => {
                const userMeta = response.body;

                this.store.setState({user: userMeta});

                return userMeta;
            });
    }

    fetchPlaylists = () => {
        return request.get('/api/playlists')
            .then(response => {
                let userPlaylists = response.body.map(playlistMeta => {
                    return new Playlist(playlistMeta);
                });

                this.store.setState({
                    cachedPlaylists: this.store.get('cachedPlaylists').concat(userPlaylists),
                    userPlaylists: userPlaylists
                });

                return userPlaylists;
            });
    }

    /**
     *
     * @param {String} [playlistName]
     */
    fetchPlaylist = (playlistName) => {
        return request('/api/query/playlist')
            .send({title: playlistName})
            .then(response => {
                const queriedPlaylist = new Playlist(response.body);

                this.store.setState({
                    cachedPlaylists: this.store.get('cachedPlaylists').concat([queriedPlaylist])
                });

                return queriedPlaylist;
            });
    }

    /**
     *
     * @param {SoundCollection} playlist
     */
    updatePlaylist(playlist) {
        return request.post('/api/playlist')
            .send(playlist.toJSON());
    }

    isLoggedIn() {
        return !!this.store.get('user.id');
    }
}

export default APIController;
