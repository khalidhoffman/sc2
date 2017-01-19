import React from 'react'

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class AppBarMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;

        const scopedMethods = [];
        for (const method of scopedMethods) {
            this[method] = this[method].bind(this);
        }
    }

    static get defaultProps() {
        return {
            actions: [
                {
                    label: 'N/A',
                    callback: function () {
                        console.log('n/a')
                    }
                }
            ]
        }
    }

    render() {
        const iconStyle = {
            color: '#ffffff'
        };
        return (
            <IconMenu iconButtonElement={<IconButton iconStyle={iconStyle}><MoreVertIcon /></IconButton>}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                {this.props.actions.map(function (actionMeta, index) {
                    return (<MenuItem key={index} primaryText={actionMeta.label} onClick={actionMeta.callback}/>)
                })}
            </IconMenu>
        )
    }
}

export default AppBarMenu;
