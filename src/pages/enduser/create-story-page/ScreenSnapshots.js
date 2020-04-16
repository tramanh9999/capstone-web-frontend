import React from 'react';
// import { Tooltip } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, Tooltip } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import ValidationUtils from '../../../utils/validation';
import StringUtils from '../../../utils/string';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      height: 400,
      maxWidth: '100%',
      overflow: 'auto',
      backgroundColor: theme.palette.background.paper,
    },
    text: {
        fontSize: '10px'
    }
}));

const ScreenSnapshots = (props) => {
    const { screens, setCurrentScreen, currentScreen, onRemoveScreen, page } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            
            {screens.map((screen, index) => (
                <ListItem 
                    selected={ValidationUtils.isEmpty(currentScreen) ? false : (screen.id === currentScreen.id)} 
                    button  
                    key={screen.id} 
                    // onClick={() => { console.log('click'); setCurrentScreen(screen.id) }}
                    >
                    <div className="d-flex">
                        <div 
                            style={{ minWidth: '200px' }}
                            className="" 
                            onClick={() => { setCurrentScreen(screen.id) }}>
                            <ListItemText 
                                className={classes.text}
                                primary={`#${ (page-1) * 10 + index + 1 } (${StringUtils.getObjTitle(screen)})`} />
                            <small>{ StringUtils.truncate(StringUtils.removeHtml(screen.content), 60) }</small>
                        </div>
                        <div className="">
                            <ListItemSecondaryAction style={{ float: 'right' }}>
                                <Tooltip title="Xóa màn hình" placement="top">
                                    <IconButton edge="end" aria-label="delete" onClick={() => onRemoveScreen(screen.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </div>
                    </div>
                </ListItem>
            ))}
            
        </div>
    );
};


export default ScreenSnapshots;
