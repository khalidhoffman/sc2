import Controller from './base-controller';
import {Howl} from 'howler';

class MediaController extends Controller {
    constructor() {
        super(...arguments);

        this.config = {
            howlerNamespace: 'sc2'
        };
        this.state = {
            volume: .5,
            loop: false,
            pausePoint: null,
            howler: {
                activeSoundId: null
            }
        };
        this.store.on('isPlaying', this.onPlayStateChange);
    }

    /**
     *
     * @param {Sound} sound
     */
    setActiveSound = (sound) => {
        this.state.howler.activeSoundId = null;
        this.state.pausePoint = null;
        this.state.mp3URL = `/api/stream?url=${sound.get('stream_url')}`;

        this.store.setState({activeSound: sound});


        if (this.audio) {
            this.audio.unload();
        }

        this.audio = new Howl({
            src: [this.state.mp3URL],
            format: ['mp3'],
            autoplay: false,
            loop: this.state.loop,
            volume: this.state.volume,
            onend: this.onMP3Complete,
            onplay: this.onPlay,
            html5: true
        });

        if (sound) {
            if (this.store.get('isPlaying')) {
                this.playAudio();
            }
        }
    }

    getActiveSound() {
        return this.store.get('activeSound');
    }

    setPlaylist = (playlist) => {
        this.store.setState({activePlaylist: playlist});
    }

    playAudio = () => {
        if (!this.audio) {
            console.error('audio not available');
            return;
        }

        if (this.state.howler.activeSoundId) {
            return this.audio.play(this.state.howler.activeSoundId);
        }

        this.state.howler.activeSoundId = this.audio.play();

        return this.state.howler.activeSoundId;
    }

    pauseAudio = () => {
        this.audio.pause();
        this.state.pausePoint = this.audio.seek(this.state.howler.activeSoundId);
    }

    togglePlayState = () => {
        const isPlaying = this.store.get('isPlaying');

        this.store.setState({isPlaying: !isPlaying});
    }

    isPlaying = () => {
        return this.store.get('isPlaying');
    }

    setPlaylistSounds = (sounds) => {
        const activePlaylist = this.store.get('activePlaylist');

        activePlaylist.setSounds(sounds);
        this.setPlaylist(Object.assign({}, activePlaylist));
    }

    onPlay = () => {
        if (this.state.pausePoint) {
            this.audio.seek(this.state.pausePoint, this.state.howler.activeSoundId);
        }
    }

    onPlayStateChange = (isPlaying) => {
        if (this.audio) {
            if (isPlaying && isPlaying !== this.audio.playing(this.state.howler.activeSoundId)) {
                this.playAudio();
            } else {
                this.pauseAudio();
            }
        }
    }

    onMP3Complete = () => {
        console.log(`done playing: ${this.state.mp3URL}`);
    }
}

export default MediaController;
