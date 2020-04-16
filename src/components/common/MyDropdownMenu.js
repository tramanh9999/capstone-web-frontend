import React, { useState } from 'react';
import { Menu, IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

const MyDropdownMenu = (props) => {
    const id = Math.random().toString();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
  
    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls={id} 
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVert />
            </IconButton>
           
            <Menu
                id={id}
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                {props.children}
            </Menu>
        </div>
    );
};


export default MyDropdownMenu;
