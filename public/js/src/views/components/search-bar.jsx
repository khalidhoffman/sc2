import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        };
    }

    static get propTypes() {
        return {
            onSearch: PropTypes.func
        };
    }

    updateSearchValue = (evt) => {
        this.setState({
            searchValue: evt.target.value
        });
    }

    onSearch = () => {
        if (this.props.onSearch) this.props.onSearch(this.state.searchValue);
    }

    render() {
        const searchBarStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${12 / 16}em`
        };
        const searchInputStyle = {
            flex: 1
        };
        const searchButtonStyle = {
            flexShrink: 0,
            marginLeft: '.4em'
        };

        return (
            <div className="search-bar" style={searchBarStyle}>
                <TextField id='search-bar-text'
                           style={searchInputStyle}
                           className="search-bar__input"
                           type='text'
                           value={this.state.searchValue}
                           onChange={this.updateSearchValue}/>
                <FlatButton className='search-bar__button' onClick={this.onSearch} label="Search"
                            style={searchButtonStyle}/>
            </div>);
    }
}

export default SearchBar;