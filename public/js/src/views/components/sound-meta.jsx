import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default class SoundMeta extends React.PureComponent {
    constructor() {
        super(...arguments);

    }

    static get defaultProps() {
        return {
            albumArt: 'https://placehold.it/500x500',
            soundTitle: 'n/a',
            artistName: 'n/a'
        };
    }

    static get propTypes() {
        return {
            albumArt: PropTypes.string,
            soundTitle: PropTypes.string,
            artistName: PropTypes.string
        };
    }

    render() {
        const soundMetaClassNames = classNames({
            'sound-meta': true
        });
        const albumArtProps = {
            src: this.props.albumArt,
            alt: this.props.soundTitle
        };

        return (
            <div className={soundMetaClassNames}>
                <span>{this.props.soundTitle}</span>
                <img {...albumArtProps} />
            </div>);
    }
}
