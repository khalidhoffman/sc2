webpackJsonp([0],{

/***/ 240:
/***/ (function(module, exports, __webpack_require__) {

const Sound = __webpack_require__(241);

class SoundCollection {
    /**
     *
     * @param meta
     */
    constructor(meta) {
        this.meta = meta;
        this.sounds = this.meta.tracks.map((soundMeta) => {
            if (!soundMeta['stream_url']) console.warn('invalid song found: %s', soundMeta.title);
            return new Sound(soundMeta)
        });
		this.meta.uri = this.meta.uri || `http://api.soundcloud.com/playlists/${this.meta.id}`
    }

    getSounds() {
        return this.sounds;
    }

    /**
     *
     * @param {Sound[]|Object[]} sounds
     */
    setSounds(sounds) {
        this.sounds = sounds.map((sound) => {
            if (sound instanceof Sound) {
                return sound
            } else {
                return new Sound(sound);
            }
        });

        this.set('tracks', this.sounds.map(sound=> sound.toJSON()))
    }

    toJSON() {
        return this.meta;
    }

    toArray() {
        return this.sounds;
    }

    getTitle() {
        return this.meta.title;
    }

    get(propName){
        return this.meta[propName];
    }

    set(propName, val){
        return this.meta[propName] = val;
    }

}

module.exports = SoundCollection;


/***/ }),

/***/ 241:
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(67);
const Debuggable = __webpack_require__(424);

class Sound extends Debuggable {

    /**
     *
     * @param {Object} mp3Meta
     * @param {Object} [options]
     * @constructor
     */
    constructor(mp3Meta, options) {
        super({
            debugTag: 'Sound: ',
            debugLevel: Debuggable.PROD
        });
        this.meta = mp3Meta;
        this.config = _.defaults(options, {
            artworkURL: this.meta['artwork_url'],
            artworkExtension: '.jpg'
        });

    }

    /**
     *
     * @returns {Object}
     */
    getMeta(){
        return this.meta;
    }

    get(key){
        return this.meta[key];
    }

    set(key, val){
        return this.meta[key] = val;
    }

    getId(){
        return this.meta.id;
    }

    getTitle(){
        return this.meta.title;
    }

    getArtworkURL(){
        return this.meta['artwork_url'];
    }

    toJSON(){
       return this.meta;
    }

    isValid() {
        return !!this.meta['stream_url'];
    }
}

module.exports = Sound;


/***/ }),

/***/ 306:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(52);

_app.instance.render(document.getElementById('root'));

/***/ }),

/***/ 403:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = function () {
    function Router() {
        _classCallCheck(this, Router);
    }

    _createClass(Router, [{
        key: 'path',
        value: function path(_path) {
            location.href = _path;
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            location.reload();
        }
    }, {
        key: 'showHelp',
        value: function showHelp() {
            console.log('show help');
        }
    }, {
        key: 'login',
        value: function login() {
            location.href = '/login';
        }
    }, {
        key: 'logout',
        value: function logout() {
            location.href = '/logout';
        }
    }]);

    return Router;
}();

exports.default = Router;

/***/ }),

/***/ 404:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(67);

var _BehaviorSubject = __webpack_require__(151);

__webpack_require__(230);

__webpack_require__(232);

__webpack_require__(235);

__webpack_require__(236);

__webpack_require__(238);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    _createClass(Store, null, [{
        key: 'compare',
        value: function compare(preVal, newVal, path) {
            return (0, _lodash.get)(newVal, path) === (0, _lodash.get)(preVal, path);
        }
    }]);

    function Store() {
        var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Store);

        this.state = defaultState;
        this.observable = new _BehaviorSubject.BehaviorSubject(this.state);
        this.subscriptions = {};
    }

    _createClass(Store, [{
        key: 'setState',
        value: function setState(state) {
            this.state = Object.assign({}, this.state, state);
            return this.observable.next(this.state);
        }
    }, {
        key: 'getState',
        value: function getState() {
            return this.state;
        }
    }, {
        key: 'get',
        value: function get(path) {
            return (0, _lodash.get)(this.state, path);
        }
    }, {
        key: 'subscribe',
        value: function subscribe(callback) {
            this.observable.subscribe({ next: callback });
        }

        /**
         * Passes the changed value on state changes
         * @param path
         * @param callback
         */

    }, {
        key: 'on',
        value: function on(path, callback) {
            var observable = this.getObservable(path).subscribe({ next: callback });

            this.subscriptions[path] = this.subscriptions[path] || { callbacks: [], observables: [] };
            this.subscriptions[path].callbacks.push(callback);
            this.subscriptions[path].observables.push(observable);

            return (0, _lodash.last)(this.subscriptions[path].observables);
        }

        /**
         * Passes the changed value on state changes
         * @param path
         * @param callback
         */

    }, {
        key: 'off',
        value: function off(path, callback) {
            var callbackIdx = this.subscriptions[path].callbacks.indexOf(callback);
            var removedObservables = void 0;

            if (callbackIdx < 0) {
                console.warn('failed to unsubscribe');
                return;
            }

            this.subscriptions[path].callbacks.splice(callbackIdx, 1);
            removedObservables = this.subscriptions[path].observables.splice(callbackIdx, 1);
            removedObservables.forEach(function (observable) {
                return observable.unsubscribe();
            });
        }

        /**
         * Passes the entire state on state changes
         * @param path
         * @param callback
         */

    }, {
        key: 'watch',
        value: function watch(path, callback) {
            return this.getStateObservable(path).subscribe({ next: callback });
        }
    }, {
        key: 'getStateObservable',
        value: function getStateObservable(path) {
            return path ? this.observable.distinctUntilChanged(function (prev, state) {
                return Store.compare(prev, state, path);
            }) : this.observable;
        }
    }, {
        key: 'getObservable',
        value: function getObservable(path) {
            return this.getStateObservable(path).map(function (state) {
                return (0, _lodash.get)(state, path);
            });
        }
    }]);

    return Store;
}();

module.exports = Store;

/***/ }),

/***/ 408:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = __webpack_require__(239);

var _superagent2 = _interopRequireDefault(_superagent);

var _jquery = __webpack_require__(415);

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = __webpack_require__(67);

var _soundcloudLib = __webpack_require__(78);

var _baseController = __webpack_require__(79);

var _baseController2 = _interopRequireDefault(_baseController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var APIController = function (_Controller) {
    _inherits(APIController, _Controller);

    function APIController() {
        _classCallCheck(this, APIController);

        var _this = _possibleConstructorReturn(this, (APIController.__proto__ || Object.getPrototypeOf(APIController)).apply(this, arguments));

        _this.fetchUserData = function () {
            return _superagent2.default.get('/api/user').then(function (response) {
                var userMeta = response.body;

                _this.store.setState({ user: userMeta });

                return userMeta;
            });
        };

        _this.fetchPlaylists = function () {
            return _superagent2.default.get('/api/playlists').then(function (response) {
                var userPlaylists = response.body.map(function (playlistMeta) {
                    return new _soundcloudLib.SoundCollection(playlistMeta);
                });

                _this.store.setState({
                    cachedPlaylists: _this.store.get('cachedPlaylists').concat(userPlaylists),
                    userPlaylists: userPlaylists
                });

                return userPlaylists;
            });
        };

        _this.fetchPlaylist = function (playlistName) {
            return (0, _superagent2.default)('/api/query/playlist').send({ title: playlistName }).then(function (response) {
                var queriedPlaylist = new _soundcloudLib.SoundCollection(response.body);

                _this.store.setState({
                    cachedPlaylists: _this.store.get('cachedPlaylists').concat([queriedPlaylist])
                });

                return queriedPlaylist;
            });
        };

        return _this;
    }

    /**
     *
     * @param {String} [playlistName]
     */


    _createClass(APIController, [{
        key: 'updatePlaylist',


        /**
         *
         * @param {SoundCollection} playlist
         */
        value: function updatePlaylist(playlist) {
            return _superagent2.default.post('/api/playlist').send(playlist.toJSON());
        }
    }, {
        key: 'isLoggedIn',
        value: function isLoggedIn() {
            return !!this.store.get('user.id');
        }
    }]);

    return APIController;
}(_baseController2.default);

exports.default = APIController;

/***/ }),

/***/ 416:
/***/ (function(module, exports, __webpack_require__) {

const url = __webpack_require__(417);
const request = __webpack_require__(239);
const formurlencoded = __webpack_require__(423);
const _ = __webpack_require__(67);

const SoundCollection = __webpack_require__(240);

class User {

	/**
	 *
	 * @param {String} [username]
	 * @param {Object} [options]
	 * @param {String} [options.cachePath]
	 * @param {String} [options.clientId]
	 * @param {Object} [options.meta]
	 * @param {String} [options.saveDir]
	 * @constructor
	 */
	constructor(username, options) {
		this._config = _.defaults(_.isString(username) ? options : username, {
			clientId: 'INVALID_SOUNDCLOUD_CLIENT_ID',
			accessToken: '',
			apiURL: 'https://api.soundcloud.com',
			meta: {
				permalink_url: `http://soundcloud.com/${username}`
			}
		});

		this.setUserMeta(this._config.meta);
		this.playlists = [];
	}

	/**
	 *
	 * @returns {Promise}
	 * @private
	 */
	_onError(err) {
		console.error(err);
		return Promise.reject(err);
	}

	/**
	 *
	 * @returns {Promise}
	 * @private
	 */
	_getPlaylists() {
		return request.get(url.resolve(this._config.apiURL, `/me/playlists`))
			.query({
				client_id: this._config.clientId,
				oauth_token: this._config.accessToken
			})
			.then(response => {
				return this.playlists = _.chain(response.body)
					.uniqBy(function (playlistMeta) {
						return playlistMeta.title
					})
					.map((playlistMeta) => {
						return new SoundCollection(
							playlistMeta,
							{
								clientId: this._config.clientId,
								saveDir: this._config.saveDir,
								local: this._config.local
							})
					})
					.value();
			})
	}

	/**
	 *
	 * @param {Object|SoundCollection} playlist
	 * @returns {Promise}
	 * @private
	 */
	_updatePlaylist(playlist) {
		const accessibleProps = ['title', 'tracks'];
		const playlistMeta = playlist instanceof SoundCollection ? playlist.toJSON() : playlist;
		const formData = {
			playlist: _.pick(playlistMeta, accessibleProps),
			format: 'json',
			client_id: this._config.clientId
		};
		const playlistUri = playlistMeta.uri || `http://api.soundcloud.com/playlists/${playlistMeta.id}`

		return request.put(playlistUri)
			.type('form')
			.query({
				oauth_token: this._config.accessToken
			})
			.send(formData)
			.then(response => response.body);
	}

	/**
	 *
	 * @param {Object|SoundCollection} playlist
	 * @returns {Promise}
	 * @private
	 */
	_createPlaylist(playlist) {
		const accessibleProps = ['title', 'tracks'];
		const playlistMeta = playlist instanceof SoundCollection ? playlist.toJSON() : playlist;
		const formData = {
			playlist: _.pick(playlistMeta, accessibleProps),
			format: 'json',
			client_id: this._config.clientId
		};

        formData.playlist.tracks = formData.playlist.tracks.map(track => _.pick(track, ['id']));

		return request.post('http://api.soundcloud.com/playlists/')
			.type('form')
			.query({
				oauth_token: this._config.accessToken
			})
			.send(formurlencoded(formData))
			.then(response => response.body);
	}

	/**
	 *
	 * @returns {Promise.<Object>}
	 */
	fetchUserMeta() {
		if (this.isLoggedIn()) {
			return Promise.resolve(this.meta);
		}

		return request.get('http://api.soundcloud.com/resolve/')
			.query({
				url: this.userURL,
				client_id: this._config.clientId
			})
			.then(response => this.setUserMeta(response.body));

	}

	/**
	 *
	 * @returns {Promise.<Object>}
	 */
	login() {
		return this.fetchUserMeta();
	}

	/**
	 *
	 * @returns {Boolean}
	 */
	isLoggedIn() {
		return !!this.meta.id;
	}

	/**
	 *
	 * @param {Object} data - should be unadulterated soundcloud data
	 */
	setUserMeta(data) {
		this.meta = data;
		if (this.meta.permalink_url) this.userURL = this.meta.permalink_url;
		if (this.meta.uri) this.userURI = this.meta.uri;
		return this.meta;
	}

	/**
	 *
	 * @returns {Promise.<SoundCollection[]>}
	 */
	getPlaylists() {
		return this.login()
			.then(() => this._getPlaylists())
			.catch(this._onError);
	}

	/**
	 *
	 * @param {String} playlistName
	 * @returns {Promise.<SoundCollection>}
	 */
	getPlaylist(playlistName) {
		return this.getPlaylists()
			.then(playlists => {
				return _.find(playlists, (playlist => {
					return playlist.get('title') === playlistName;
				}));
			})
			.catch(this._onError);
	}

	/**
	 *
	 * @param {String} playlistName
	 * @returns {Promise.<Boolean>}
	 */
	hasPlaylist(playlistName) {
		return this.getPlaylist(playlistName)
			.then(playlist => !!playlist)
			.catch(this._onError);
	}

	/**
	 *
	 * @param {SoundCollection} playlist
	 * @returns {Promise}
	 */
	setPlaylist(playlist) {
		return this.login()
			.then(() => this._updatePlaylist(playlist))
			.catch(this._onError);
	}

	/**
	 *
	 * @param {SoundCollection} playlist
	 * @returns {Promise}
	 */
	createPlaylist(playlist) {
		return this.login()
			.then(() => this._createPlaylist(playlist))
			.catch(this._onError);
	}
}

module.exports = User;


/***/ }),

/***/ 428:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = __webpack_require__(429);

var _baseController = __webpack_require__(79);

var _baseController2 = _interopRequireDefault(_baseController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationController = function (_Controller) {
    _inherits(NotificationController, _Controller);

    function NotificationController() {
        _classCallCheck(this, NotificationController);

        var _this = _possibleConstructorReturn(this, (NotificationController.__proto__ || Object.getPrototypeOf(NotificationController)).apply(this, arguments));

        _this.queue = function (text) {
            var messages = _this.store.get('messages').concat([text]);
            _this.store.setState({ messages: messages });
        };

        _this.dismissOldest = function () {
            _this.store.setState({
                messages: _this.store.get('messages').slice(1)
            });
        };

        _this.dismissAll = function () {
            _this.store.setState({
                messages: []
            });
        };

        _this.onUnread = function (callback) {
            return _this.store.getObservable('messages').mergeMap(function (messages) {
                _this.state.messages = messages;
                return _rxjs.Observable.create(function (intervalEmitter) {
                    _this.state.intervalEmitter = intervalEmitter;
                    if (!_this.state.intervalId) {
                        _this.state.intervalId = setInterval(function () {
                            _this.onNotificationTick();
                        }, 3000);
                    }
                    _this.onNotificationTick();
                });
            }).subscribe(callback);
        };

        _this.state = {
            intervalId: null,
            messages: [],
            intervalEmitter: null
        };
        return _this;
    }

    _createClass(NotificationController, [{
        key: 'onNotificationTick',
        value: function onNotificationTick() {
            if (this.state.messages.length > 0) {
                this.state.intervalEmitter.next(this.state.messages);
            } else {
                clearInterval(this.state.intervalId);
                delete this.state.intervalId;
            }
        }
    }]);

    return NotificationController;
}(_baseController2.default);

exports.default = NotificationController;

/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.instance = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(20);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _router = __webpack_require__(403);

var _router2 = _interopRequireDefault(_router);

var _main = __webpack_require__(404);

var _main2 = _interopRequireDefault(_main);

var _apiController = __webpack_require__(408);

var _apiController2 = _interopRequireDefault(_apiController);

var _notificationController = __webpack_require__(428);

var _notificationController2 = _interopRequireDefault(_notificationController);

var _searchController = __webpack_require__(702);

var _searchController2 = _interopRequireDefault(_searchController);

var _menuController = __webpack_require__(703);

var _menuController2 = _interopRequireDefault(_menuController);

var _mediaController = __webpack_require__(704);

var _mediaController2 = _interopRequireDefault(_mediaController);

var _main3 = __webpack_require__(706);

var _main4 = _interopRequireDefault(_main3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
    function App() {
        _classCallCheck(this, App);

        var defaults = {
            title: 'Hello World',
            searchText: '',
            user: {},
            userPlaylists: [],
            cachedPlaylists: [],
            messages: []
        };
        this.router = new _router2.default();
        this.store = new _main2.default(defaults);
        this.api = new _apiController2.default(this);
        this.notifications = new _notificationController2.default(this);
        this.ui = {
            search: new _searchController2.default(this),
            menu: new _menuController2.default(this)
        };
        this.media = new _mediaController2.default(this);
    }

    _createClass(App, [{
        key: "render",
        value: function render(DOMNode) {
            _reactDom2.default.render(_react2.default.createElement(_main4.default, { app: this }), DOMNode);
        }
    }]);

    return App;
}();

var instance = exports.instance = new App();
exports.default = App;

/***/ }),

/***/ 702:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseController = __webpack_require__(79);

var _baseController2 = _interopRequireDefault(_baseController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UIController = function (_Controller) {
    _inherits(UIController, _Controller);

    function UIController() {
        _classCallCheck(this, UIController);

        var _this = _possibleConstructorReturn(this, (UIController.__proto__ || Object.getPrototypeOf(UIController)).apply(this, arguments));

        _this.onSearch = function (searchText) {
            _this.store.setState({
                searchText: searchText
            });
            if (searchText) {
                _this.api.fetchPlaylist(searchText).then(function (playlists) {
                    if (!playlists[0]) return Promise.reject();
                    _this.setState({
                        activePlaylist: playlists[0]
                    });
                }).catch(function () {
                    _this.notifications.queue('Could not find \'' + searchText + '\'');
                });
            }
        };

        _this.getActions = function (namespace) {
            switch (namespace) {
                case 'header-dropdown':
                case 'menu':
                    return [{
                        label: 'Help',
                        callback: _this.router.showHelp
                    }, {
                        label: 'Refresh',
                        callback: _this.router.refresh
                    }, {
                        label: _this.api.isLoggedIn() ? 'Sign Out' : 'Sign In',
                        callback: _this.api.isLoggedIn() ? _this.router.logout : _this.router.login
                    }];

                default:
                    return [];
            }
        };

        return _this;
    }

    /**
     *
     * @param {String} namespace
     */


    return UIController;
}(_baseController2.default);

exports.default = UIController;

/***/ }),

/***/ 703:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseController = __webpack_require__(79);

var _baseController2 = _interopRequireDefault(_baseController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UIController = function (_Controller) {
    _inherits(UIController, _Controller);

    function UIController() {
        _classCallCheck(this, UIController);

        var _this = _possibleConstructorReturn(this, (UIController.__proto__ || Object.getPrototypeOf(UIController)).apply(this, arguments));

        _this.onSearch = function (searchText) {
            _this.store.setState({
                searchText: searchText
            });
            if (searchText) {
                _this.api.fetchPlaylist(searchText).then(function (playlists) {
                    if (!playlists[0]) return Promise.reject();
                    _this.setState({
                        activePlaylist: playlists[0]
                    });
                }).catch(function () {
                    _this.notifications.queue('Could not find \'' + searchText + '\'');
                });
            }
        };

        _this.getActions = function (namespace) {
            switch (namespace) {
                case 'header-dropdown':
                case 'menu':
                    return [{
                        label: 'Help',
                        callback: _this.router.showHelp
                    }, {
                        label: 'Refresh',
                        callback: _this.router.refresh
                    }, {
                        label: _this.api.isLoggedIn() ? 'Sign Out' : 'Sign In',
                        callback: _this.api.isLoggedIn() ? _this.router.logout : _this.router.login
                    }];

                default:
                    return [];
            }
        };

        _this.toggleDrawer = function () {
            _this.store.setState({
                isDrawerOpen: !_this.store.get('isDrawerOpen')
            });
        };

        _this.isDrawerOpen = function () {
            return _this.store.get('isDrawerOpen');
        };

        return _this;
    }

    /**
     *
     * @param {String} namespace
     */


    return UIController;
}(_baseController2.default);

exports.default = UIController;

/***/ }),

/***/ 704:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseController = __webpack_require__(79);

var _baseController2 = _interopRequireDefault(_baseController);

var _howler = __webpack_require__(705);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaController = function (_Controller) {
    _inherits(MediaController, _Controller);

    function MediaController() {
        _classCallCheck(this, MediaController);

        var _this = _possibleConstructorReturn(this, (MediaController.__proto__ || Object.getPrototypeOf(MediaController)).apply(this, arguments));

        _this.setActiveSound = function (sound) {
            _this.state.howler.activeSoundId = null;
            _this.state.pausePoint = null;
            _this.state.mp3URL = '/api/stream?url=' + sound.get('stream_url');

            _this.store.setState({ activeSound: sound });

            if (_this.audio) {
                _this.audio.unload();
            }

            _this.audio = new _howler.Howl({
                src: [_this.state.mp3URL],
                format: ['mp3'],
                autoplay: false,
                loop: _this.state.loop,
                volume: _this.state.volume,
                onend: _this.onMP3Complete,
                onplay: _this.onPlay,
                html5: true
            });

            if (sound) {
                if (_this.store.get('isPlaying')) {
                    _this.playAudio();
                }
            }
        };

        _this.setPlaylist = function (playlist) {
            _this.store.setState({ activePlaylist: playlist });
        };

        _this.playAudio = function () {
            if (!_this.audio) {
                console.error('audio not available');
                return;
            }

            if (_this.state.howler.activeSoundId) {
                return _this.audio.play(_this.state.howler.activeSoundId);
            }

            _this.state.howler.activeSoundId = _this.audio.play();

            return _this.state.howler.activeSoundId;
        };

        _this.pauseAudio = function () {
            _this.audio.pause();
            _this.state.pausePoint = _this.audio.seek(_this.state.howler.activeSoundId);
        };

        _this.togglePlayState = function () {
            var isPlaying = _this.store.get('isPlaying');

            _this.store.setState({ isPlaying: !isPlaying });
        };

        _this.isPlaying = function () {
            return _this.store.get('isPlaying');
        };

        _this.setPlaylistSounds = function (sounds) {
            var activePlaylist = _this.store.get('activePlaylist');

            activePlaylist.setSounds(sounds);
            _this.setPlaylist(Object.assign({}, activePlaylist));
        };

        _this.onPlay = function () {
            if (_this.state.pausePoint) {
                _this.audio.seek(_this.state.pausePoint, _this.state.howler.activeSoundId);
            }
        };

        _this.onPlayStateChange = function (isPlaying) {
            if (_this.audio) {
                if (isPlaying && isPlaying !== _this.audio.playing(_this.state.howler.activeSoundId)) {
                    _this.playAudio();
                } else {
                    _this.pauseAudio();
                }
            }
        };

        _this.onMP3Complete = function () {
            console.log('done playing: ' + _this.state.mp3URL);
        };

        _this.config = {
            howlerNamespace: 'sc2'
        };
        _this.state = {
            volume: .5,
            loop: false,
            pausePoint: null,
            howler: {
                activeSoundId: null
            }
        };
        _this.store.on('isPlaying', _this.onPlayStateChange);
        return _this;
    }

    /**
     *
     * @param {Sound} sound
     */


    _createClass(MediaController, [{
        key: 'getActiveSound',
        value: function getActiveSound() {
            return this.store.get('activeSound');
        }
    }]);

    return MediaController;
}(_baseController2.default);

exports.default = MediaController;

/***/ }),

/***/ 706:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__(67);

var _interval = __webpack_require__(244);

var _classnames = __webpack_require__(115);

var _classnames2 = _interopRequireDefault(_classnames);

var _reactTapEventPlugin = __webpack_require__(707);

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

var _MuiThemeProvider = __webpack_require__(713);

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _CircularProgress = __webpack_require__(797);

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _Drawer = __webpack_require__(802);

var _Drawer2 = _interopRequireDefault(_Drawer);

var _MenuItem = __webpack_require__(178);

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _soundcloudLib = __webpack_require__(78);

var _app = __webpack_require__(52);

var _notification = __webpack_require__(845);

var _notification2 = _interopRequireDefault(_notification);

var _playlist = __webpack_require__(853);

var _header = __webpack_require__(988);

var _header2 = _interopRequireDefault(_header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainView = function (_PureComponent) {
    _inherits(MainView, _PureComponent);

    function MainView(props) {
        _classCallCheck(this, MainView);

        var _this = _possibleConstructorReturn(this, (MainView.__proto__ || Object.getPrototypeOf(MainView)).call(this, props));

        _this.setPlaylist = function (playlist) {
            _app.instance.media.setPlaylist(playlist);
        };

        _this.isBusy = function () {
            return _this.state.loadingQueue > 0;
        };

        _this.showLoading = function () {
            _this.setState({
                loadingQueue: _this.state.loadingQueue + 1
            });
            return Promise.resolve();
        };

        _this.hideLoading = function () {
            _this.setState({
                loadingQueue: _this.state.loadingQueue - 1
            });
            return Promise.resolve();
        };

        _this.onDrawerEvent = function (currentDrawerState, event) {
            switch (event) {
                case 'clickaway':
                case 'escape':
                    if (_app.instance.ui.menu.isDrawerOpen()) {
                        _app.instance.ui.menu.toggleDrawer();
                    }
                    break;
                default:
                    break;
            }
        };

        _this.onPlaylistDrawerItemClick = function (playlist) {
            _app.instance.media.setPlaylist(playlist);
            _app.instance.ui.menu.toggleDrawer();
        };

        (0, _reactTapEventPlugin2.default)();
        _this.state = {
            playlists: [],
            loadingQueue: 0
        };
        return _this;
    }

    /**
     *
     * @param {Playlist} playlist
     */


    /**
     *
     * @param {SoundCollection} playlist
     */


    _createClass(MainView, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            _app.instance.store.on('isDrawerOpen', function (isDrawerOpen) {
                _this2.setState({ isDrawerOpen: isDrawerOpen });
            });

            _app.instance.store.on('activePlaylist', function (activePlaylist) {
                if (!activePlaylist) return;
                _this2.setState({ activePlaylist: activePlaylist });
            });

            _app.instance.store.on('userPlaylists', function (playlists) {
                if (!playlists) return;
                _this2.setState({ playlists: playlists });
            });

            _app.instance.store.on('searchText', function (searchText) {
                _this2.setState({
                    activePlaylistName: searchText
                });
            });

            _app.instance.store.getObservable('searchText').debounce(function () {
                return (0, _interval.interval)(1000);
            }).subscribe(function (name) {
                if (!name) return;
                // TODO investigate why this scope is not of MainView Class
                var playlist = (0, _lodash.find)(_app.instance.store.get('cachedPlaylists'), function (playlist) {
                    return playlist.getTitle() === name;
                });
                if (playlist) {
                    _app.instance.media.setPlaylist(playlist);
                } else {
                    _app.instance.notifications.queue("invalid playlist name");
                    setTimeout(function () {
                        _app.instance.store.setState({
                            searchText: ''
                        });
                    }, 2000);
                }
            });

            this.showLoading().then(_app.instance.api.fetchUserData).then(_app.instance.api.fetchPlaylists).then(this.hideLoading).catch(function (err) {
                _this2.hideLoading();
                _app.instance.notifications.queue('Please sign in', err);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var sideDrawerProps = {
                docked: false,
                className: (0, _classnames2.default)({
                    'sidebar': true,
                    'sidebar--playlists': true,
                    'sidebar--side': true
                }),
                containerClassName: (0, _classnames2.default)({
                    'sidebar__drawer': true
                }),
                zDepth: 2,
                open: _app.instance.ui.menu.isDrawerOpen(),
                onRequestChange: this.onDrawerEvent,
                overlayStyle: {
                    zIndex: 9
                },
                containerStyle: {
                    zIndex: 10,
                    paddingTop: '64px'
                }
            };
            var MainView = function MainView() {
                var mainViewName = _this3.isBusy() ? 'loading' : 'default';

                switch (mainViewName) {
                    case 'loading':
                    case 'busy':
                        var loadingViewClass = (0, _classnames2.default)({
                            'loading-view': true,
                            'loading-view--active': _this3.isBusy()
                        });
                        return _react2.default.createElement(
                            'div',
                            { className: loadingViewClass },
                            _react2.default.createElement(_CircularProgress2.default, { size: 80, thickness: 5 })
                        );
                    case 'list':
                    default:
                        if (!_this3.state.activePlaylist) {
                            return _react2.default.createElement(
                                'center',
                                null,
                                _react2.default.createElement(
                                    'h3',
                                    null,
                                    'Welcome'
                                )
                            );
                        }

                        var sortablePlaylistProps = {
                            onSortEnd: _this3.onSoundMoved,
                            pressDelay: 250,
                            playlist: _this3.state.activePlaylist
                        };

                        return _react2.default.createElement(_playlist.SortablePlaylist, sortablePlaylistProps);
                }
            };
            var playlistMenuItems = this.state.playlists.map(function (playlist, index) {
                var drawerItemProps = {
                    onClick: function onClick() {
                        return _this3.onPlaylistDrawerItemClick(playlist);
                    },
                    title: playlist.getTitle()
                };
                return _react2.default.createElement(
                    _MenuItem2.default,
                    _extends({ key: index }, drawerItemProps),
                    drawerItemProps.title
                );
            });

            return _react2.default.createElement(
                _MuiThemeProvider2.default,
                null,
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_header2.default, null),
                    _react2.default.createElement(
                        _Drawer2.default,
                        sideDrawerProps,
                        playlistMenuItems
                    ),
                    _react2.default.createElement(MainView, null),
                    _react2.default.createElement(_notification2.default, null)
                )
            );
        }
    }]);

    return MainView;
}(_react.PureComponent);

exports.default = MainView;

/***/ }),

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { 
    User : __webpack_require__(416),
    SoundCollection : __webpack_require__(240),
    Sound: __webpack_require__(241)
}


/***/ }),

/***/ 79:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function Controller(app) {
    _classCallCheck(this, Controller);

    this.router = app.router;
    this.store = app.store;
    this.api = app.api;
    this.notifications = app.notifications;
};

exports.default = Controller;

/***/ }),

/***/ 845:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(115);

var _classnames2 = _interopRequireDefault(_classnames);

var _Snackbar = __webpack_require__(846);

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _app = __webpack_require__(52);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Notification = function (_React$Component) {
    _inherits(Notification, _React$Component);

    function Notification(props) {
        _classCallCheck(this, Notification);

        var _this = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).apply(this, arguments));

        _this.state = {
            text: ':-)',
            isVisible: false,
            type: 'default'
        };
        _this.store = _app.instance.store;
        _this.notifications = _app.instance.notifications;
        return _this;
    }

    _createClass(Notification, [{
        key: 'notifyUser',
        value: function notifyUser(message) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.setState({
                    text: message,
                    isVisible: true
                });

                setTimeout(function () {
                    _this2.hide().then(resolve, reject);
                }, _this2.props.notificationDuration);
            });
        }
    }, {
        key: 'hide',
        value: function hide() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.setState({
                    isVisible: false
                });

                setTimeout(function () {
                    resolve();
                }, _this3.props.animationOutDuration);
            });
        }
    }, {
        key: 'isVisible',
        value: function isVisible() {
            return this.state.isVisible;
        }
    }, {
        key: 'getType',
        value: function getType() {
            return this.state.type;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this4 = this;

            this.notifications.onUnread(function (messages) {
                messages.reduce(function (messageQueue, message) {
                    return messageQueue.then(function () {
                        return _this4.notifyUser(message);
                    });
                }, Promise.resolve()).then(_this4.notifications.dismissAll);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_Snackbar2.default, { open: this.state.isVisible, message: this.state.text });
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {
                notificationDuration: 2500,
                animationOutDuration: 400,
                animationInDuration: 400
            };
        }
    }]);

    return Notification;
}(_react2.default.Component);

exports.default = Notification;

/***/ }),

/***/ 853:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SortablePlaylist = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _SelectField = __webpack_require__(854);

var _SelectField2 = _interopRequireDefault(_SelectField);

var _MenuItem = __webpack_require__(178);

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Paper = __webpack_require__(73);

var _Paper2 = _interopRequireDefault(_Paper);

var _propTypes = __webpack_require__(124);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = __webpack_require__(115);

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = __webpack_require__(67);

var _reactSortableHoc = __webpack_require__(290);

var _app = __webpack_require__(52);

var _soundcloudLib = __webpack_require__(78);

var _sound = __webpack_require__(977);

var _playlistMediaControls = __webpack_require__(979);

var _playlistMediaControls2 = _interopRequireDefault(_playlistMediaControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Playlist = function (_React$Component) {
    _inherits(Playlist, _React$Component);

    function Playlist() {
        _classCallCheck(this, Playlist);

        var _this = _possibleConstructorReturn(this, (Playlist.__proto__ || Object.getPrototypeOf(Playlist)).apply(this, arguments));

        _this.onSortMethodChange = function (sortMethod) {
            _this.setState({ sortMethod: sortMethod });
        };

        _this.onPlaylistSortSelected = function (evt, index) {
            // TODO probably shouldn't edit activePlaylist in state
            var sortKey = _this.state.sortMethods[index] && _this.state.sortMethods[index].val;
            var sortedSounds = (0, _lodash.sortBy)(_this.props.playlist.getSounds(), [function (sound) {
                var sortVal = sound.get(sortKey);
                if ((0, _lodash.isString)(sortVal)) {
                    return sortVal.replace(/[^a-z0-9]/ig, '');
                }
                return sortVal;
            }]);
            var updatedPlaylist = new _soundcloudLib.SoundCollection(_this.props.playlist.toJSON());

            updatedPlaylist.setSounds(sortedSounds);
            _app.instance.store.setState({
                activePlaylist: updatedPlaylist,
                sortMethod: sortKey
            });
            _app.instance.api.updatePlaylist(_this.props.playlist).then(function () {
                return _app.instance.notifications.queue('Updated \'' + _this.props.playlist.getTitle() + '\'');
            }).catch(function (err) {
                switch (err.code) {
                    case 413:
                        _app.instance.notifications.queue('Playlist too large to update');
                        break;
                    default:
                        _app.instance.notifications.queue('Failed to update \'' + _this.props.playlist.getTitle() + '\'');
                        break;
                }
            });
        };

        _this.onSoundToggled = function (toggledSound) {
            var currentSound = _app.instance.media.getActiveSound('activeSound');

            _app.instance.media.setActiveSound(toggledSound);

            if (!currentSound || currentSound && currentSound.getId() !== toggledSound.getId()) {
                _app.instance.store.setState({ isPlaying: true });
            } else {
                _app.instance.media.togglePlayState();
            }
        };

        _this.onActiveSoundChange = function (activeSound) {
            _this.setState({ activeSound: activeSound });
        };

        _this.onPlayStateChange = function (isPlaying) {
            _this.setState({ isPlaying: isPlaying });
        };

        _this.componentDidMount = function () {
            _app.instance.store.on('sortMethod', _this.onSortMethodChange);
            _app.instance.store.on('activeSound', _this.onActiveSoundChange);
            _app.instance.store.on('isPlaying', _this.onPlayStateChange);

            if (_this.props.playlist) {
                // TODO filter setState calls for when necessary
                _this.setState({
                    sortMethods: (0, _lodash.reduce)(_this.props.playlist.getSounds(), function (collection, sound) {
                        Object.keys(sound.getMeta()).forEach(function (soundMetaPropName) {
                            if ((0, _lodash.find)(collection, { val: soundMetaPropName })) return;
                            collection.push({
                                val: soundMetaPropName,
                                label: soundMetaPropName
                            });
                        });
                        return collection;
                    }, [])
                });
            }
        };

        _this.componentWillUnmount = function () {
            _app.instance.store.off('sortMethod', _this.onSortMethodChange);
            _app.instance.store.off('activeSound', _this.onActiveSoundChange);
            _app.instance.store.off('isPlaying', _this.onPlayStateChange);
        };

        _this.state = {
            sortMethod: 'default'
        };
        return _this;
    }

    _createClass(Playlist, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var DropDownMenu = function DropDownMenu() {
                var selectFieldProps = {
                    floatingLabelText: 'sort by',
                    onChange: _this2.onPlaylistSortSelected,
                    value: _this2.state.sortMethod,
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
                var dropdownBackgroundProps = {
                    zDepth: 1,
                    className: (0, _classnames2.default)({
                        'playlist__sort': true
                    }),
                    style: {
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)'
                    }
                };
                var sortMethods = _this2.state.sortMethods || _this2.props.sortMethods;
                var sortMethodMenuItems = sortMethods.map(function (method, idx) {
                    var menuItemProps = {
                        key: idx,
                        value: method.val,
                        primaryText: method.label || method.val
                    };
                    return _react2.default.createElement(_MenuItem2.default, menuItemProps);
                });

                return _react2.default.createElement(
                    _Paper2.default,
                    dropdownBackgroundProps,
                    _react2.default.createElement(
                        _SelectField2.default,
                        selectFieldProps,
                        sortMethodMenuItems
                    )
                );
            };
            var sounds = this.props.playlist.getSounds().map(function (sound, idx) {
                var soundProps = {
                    key: sound.getId() + '-' + idx,
                    index: idx,
                    sound: sound,
                    onClick: _this2.onSoundToggled
                };
                return _react2.default.createElement(_sound.SortableSound, soundProps);
            });
            var mediaControlsProps = {
                onPlayButtonToggled: _app.instance.media.togglePlayState,
                isPlaying: this.state.isPlaying,
                sound: this.state.activeSound
            };

            return _react2.default.createElement(
                'div',
                { className: 'playlist' },
                _react2.default.createElement(DropDownMenu, null),
                _react2.default.createElement(
                    'div',
                    { className: 'playlist__sounds' },
                    sounds
                ),
                mediaControlsProps.sound ? _react2.default.createElement(_playlistMediaControls2.default, mediaControlsProps) : null
            );
        }
    }], [{
        key: 'propTypes',
        get: function get() {
            return {
                playlist: _propTypes2.default.instanceOf(_soundcloudLib.SoundCollection),
                sortMethods: _propTypes2.default.array,
                onSortChange: _propTypes2.default.func,
                onSoundToggled: _propTypes2.default.func
            };
        }
    }, {
        key: 'defaultProps',
        get: function get() {
            return {
                sortMethods: []
            };
        }
    }]);

    return Playlist;
}(_react2.default.Component);

var SortablePlaylist = exports.SortablePlaylist = (0, _reactSortableHoc.SortableContainer)(function (props) {
    var onSortEnd = function onSortEnd(_ref) {
        var prevIndex = _ref.prevIndex,
            newIndex = _ref.newIndex;

        if (prevIndex === newIndex) return; // order was not changed
        var activePlaylist = _app.instance.store.get('activePlaylist');

        _app.instance.media.setPlaylistSounds((0, _reactSortableHoc.arrayMove)(activePlaylist.getSounds(), prevIndex, newIndex));
        _app.instance.api.updatePlaylist(undefined.state.activePlaylist).then(function () {
            _app.instance.notifications.queue('Updated \'' + undefined.state.activePlaylist.getTitle() + '\'');
        }).catch(function (err) {
            switch (err.code) {
                case 413:
                    _app.instance.notifications.queue('Playlist too large to update');
                    break;
                default:
                    _app.instance.notifications.queue('Failed to update \'' + undefined.state.activePlaylist.getTitle() + '\'');
                    break;
            }
        });
    };
    var mergedProps = Object.assign({}, props, { onSortEnd: onSortEnd });

    return _react2.default.createElement(Playlist, mergedProps);
});

exports.default = Playlist;

/***/ }),

/***/ 977:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SortableSound = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _hammerjs = __webpack_require__(978);

var _hammerjs2 = _interopRequireDefault(_hammerjs);

var _soundcloudLib = __webpack_require__(78);

var _reactSortableHoc = __webpack_require__(290);

var _propTypes = __webpack_require__(124);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _app = __webpack_require__(52);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sound = function (_React$PureComponent) {
    _inherits(Sound, _React$PureComponent);

    function Sound(props) {
        _classCallCheck(this, Sound);

        var _this = _possibleConstructorReturn(this, (Sound.__proto__ || Object.getPrototypeOf(Sound)).call(this, props));

        _this.onPan = function (evt) {
            if (!_this.el) return;
            _this.el.style = 'z-index:100; transform: translate3d(' + evt.deltaX + 'px, ' + evt.deltaY + 'px, 0)';
        };

        _this.onBindNode = function (node) {
            if (!node) return;
            _this.el = node;
            _this.hammer = new _hammerjs2.default(_this.el);
            // this.hammer.on('pan', this.onPan);
        };

        _this.onClick = function (proxyEvt, evt) {
            _this.props.onClick(_this.props.sound, evt);
        };

        return _this;
    }

    _createClass(Sound, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.hammer) this.hammer.destroy();
        }
    }, {
        key: 'render',
        value: function render() {
            var artWorkProps = {
                className: 'sound__artwork',
                style: {
                    backgroundImage: 'url(\'' + (this.props.sound.get('artwork_url') || this.props.artwork) + '\''
                }
            };

            return _react2.default.createElement(
                'div',
                { className: 'sound', ref: this.onBindNode, onClick: this.onClick },
                _react2.default.createElement('div', artWorkProps),
                _react2.default.createElement(
                    'span',
                    { className: 'sound__title' },
                    this.props.sound.getTitle()
                )
            );
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {
                artwork: 'https://placehold.it/500x500'
            };
        }
    }, {
        key: 'propTypes',
        get: function get() {
            return {
                artwork: _propTypes2.default.string,
                sound: _propTypes2.default.instanceOf(_soundcloudLib.Sound)
            };
        }
    }]);

    return Sound;
}(_react2.default.PureComponent);

var SortableSound = exports.SortableSound = (0, _reactSortableHoc.SortableElement)(function (props) {
    return _react2.default.createElement(Sound, props);
});

exports.default = Sound;

/***/ }),

/***/ 979:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _IconButton = __webpack_require__(89);

var _IconButton2 = _interopRequireDefault(_IconButton);

var _playArrow = __webpack_require__(980);

var _playArrow2 = _interopRequireDefault(_playArrow);

var _pause = __webpack_require__(981);

var _pause2 = _interopRequireDefault(_pause);

var _propTypes = __webpack_require__(124);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _app = __webpack_require__(52);

var _Toolbar = __webpack_require__(982);

var _soundMeta = __webpack_require__(987);

var _soundMeta2 = _interopRequireDefault(_soundMeta);

var _soundcloudLib = __webpack_require__(78);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaControl = function (_React$Component) {
    _inherits(MediaControl, _React$Component);

    function MediaControl() {
        _classCallCheck(this, MediaControl);

        var _this = _possibleConstructorReturn(this, (MediaControl.__proto__ || Object.getPrototypeOf(MediaControl)).apply(this, arguments));

        _this.isPlaying = function () {
            // return this.store.get('isPlaying');
            return _this.props.isPlaying;
        };

        _this.store = _app.instance.store;
        return _this;
    }

    _createClass(MediaControl, [{
        key: 'render',
        value: function render() {
            var toolBarProps = {
                style: {
                    zIndex: 2,
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            };

            var playButtonProps = {
                touch: true,
                onClick: this.props.onPlayButtonToggled,
                children: this.isPlaying() ? _react2.default.createElement(_pause2.default, null) : _react2.default.createElement(_playArrow2.default, null)
            };

            var soundMetaProps = {
                albumArt: this.props.sound.get('artwork_url'),
                soundTitle: this.props.sound.get('title'),
                artistName: this.props.sound.get('artist')

            };

            return _react2.default.createElement(
                _Toolbar.Toolbar,
                toolBarProps,
                _react2.default.createElement(
                    _Toolbar.ToolbarGroup,
                    null,
                    _react2.default.createElement(_IconButton2.default, playButtonProps)
                ),
                _react2.default.createElement(
                    _Toolbar.ToolbarGroup,
                    null,
                    _react2.default.createElement(_soundMeta2.default, soundMetaProps)
                )
            );
        }
    }], [{
        key: 'propTypes',
        get: function get() {
            return {
                isPlaying: _propTypes2.default.bool,
                onPlayButtonToggled: _propTypes2.default.func,
                sound: _propTypes2.default.instanceOf(_soundcloudLib.Sound)
            };
        }
    }]);

    return MediaControl;
}(_react2.default.Component);

exports.default = MediaControl;

/***/ }),

/***/ 987:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(115);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(124);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SoundMeta = function (_React$PureComponent) {
    _inherits(SoundMeta, _React$PureComponent);

    function SoundMeta() {
        _classCallCheck(this, SoundMeta);

        return _possibleConstructorReturn(this, (SoundMeta.__proto__ || Object.getPrototypeOf(SoundMeta)).apply(this, arguments));
    }

    _createClass(SoundMeta, [{
        key: 'render',
        value: function render() {
            var soundMetaClassNames = (0, _classnames2.default)({
                'sound-meta': true
            });
            var albumArtProps = {
                src: this.props.albumArt,
                alt: this.props.soundTitle
            };

            return _react2.default.createElement(
                'div',
                { className: soundMetaClassNames },
                _react2.default.createElement(
                    'span',
                    null,
                    this.props.soundTitle
                ),
                _react2.default.createElement('img', albumArtProps)
            );
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {
                albumArt: 'https://placehold.it/500x500',
                soundTitle: 'n/a',
                artistName: 'n/a'
            };
        }
    }, {
        key: 'propTypes',
        get: function get() {
            return {
                albumArt: _propTypes2.default.string,
                soundTitle: _propTypes2.default.string,
                artistName: _propTypes2.default.string
            };
        }
    }]);

    return SoundMeta;
}(_react2.default.PureComponent);

exports.default = SoundMeta;

/***/ }),

/***/ 988:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _app = __webpack_require__(52);

var _AppBar = __webpack_require__(989);

var _AppBar2 = _interopRequireDefault(_AppBar);

var _IconMenu = __webpack_require__(992);

var _IconMenu2 = _interopRequireDefault(_IconMenu);

var _MenuItem = __webpack_require__(178);

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _IconButton = __webpack_require__(89);

var _IconButton2 = _interopRequireDefault(_IconButton);

var _moreVert = __webpack_require__(994);

var _moreVert2 = _interopRequireDefault(_moreVert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_React$Component) {
    _inherits(Header, _React$Component);

    function Header(props) {
        _classCallCheck(this, Header);

        var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

        _this.state = props;
        _this.app = _app.instance;
        return _this;
    }

    _createClass(Header, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var RightMenu = function RightMenu() {
                var iconStyle = {
                    color: '#ffffff'
                };
                var iconProps = {
                    iconButtonElement: _react2.default.createElement(
                        _IconButton2.default,
                        { iconStyle: iconStyle },
                        _react2.default.createElement(_moreVert2.default, null)
                    ),
                    targetOrigin: { horizontal: 'right', vertical: 'top' },
                    anchorOrigin: { horizontal: 'right', vertical: 'top' }
                };
                var iconActions = _this2.app.ui.menu.getActions('header-dropdown').map(function (actionMeta, index) {
                    return _react2.default.createElement(_MenuItem2.default, { key: index, primaryText: actionMeta.label, onClick: actionMeta.callback });
                });

                return _react2.default.createElement(
                    _IconMenu2.default,
                    iconProps,
                    iconActions
                );
            };

            var headerProps = {
                style: {
                    'position': 'fixed',
                    'top': 0
                },
                onLeftIconButtonTouchTap: this.app.ui.menu.toggleDrawer,
                iconElementRight: _react2.default.createElement(RightMenu, null),
                title: "SC2"
            };
            return _react2.default.createElement(_AppBar2.default, headerProps);
        }
    }]);

    return Header;
}(_react2.default.Component);

exports.default = Header;

/***/ })

},[306]);