import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        };

        const scopedMethods = [
            'updateSearchValue',
            'onSearch'
        ];
        for (const method of scopedMethods) {
            this[method] = this[method].bind(this);
        }
    }

    static get propTypes() {
        return {
            onSearch: React.PropTypes.func
        }
    }

    updateSearchValue(evt) {
        this.setState({
            searchValue: evt.target.value
        })
    }

    onSearch() {
        if (this.props.onSearch) this.props.onSearch(this.state.searchValue);
    }

    render() {
        const searchBarStyle = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `0 ${12 / 16}em`
            },
            searchInputStyle = {
                flex: 1
            },
            searchButtonStyle = {
                flexShrink: 0,
                marginLeft: '.4em'
            };

        return (<div className="search-bar" style={searchBarStyle}>
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