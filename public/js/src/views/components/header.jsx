import React from 'react';

import {instance as app} from 'app';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
        this.app = app;
    }

    render() {

        const RightMenu = () => {
            const iconStyle = {
                color: '#ffffff'
            };
            const iconProps = {
                iconButtonElement: <IconButton iconStyle={iconStyle}><MoreVertIcon/></IconButton>,
                targetOrigin: {horizontal: 'right', vertical: 'top'},
                anchorOrigin: {horizontal: 'right', vertical: 'top'}
            };
            const iconActions = this.app.ui.menu.getActions('header-dropdown').map(function (actionMeta, index) {
                return <MenuItem key={index} primaryText={actionMeta.label} onClick={actionMeta.callback}/>;
            });

            return <IconMenu {...iconProps}>{iconActions}</IconMenu>;
        };

        const headerProps = {
            style: {
                'position': 'fixed',
                'top': 0
            },
            onLeftIconButtonTouchTap: this.app.ui.menu.toggleDrawer,
            iconElementRight: <RightMenu/>,
            title: "SC2"
        };
        return <AppBar {...headerProps} />;
    }
}

export default Header;
