import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, CardHeader, IconButton, Input, FormControl, InputLabel, CardActionArea, 
    CardActions, CardContent, CardMedia, Button, Typography, Card } from '@material-ui/core';
import { Favorite as FavoriteIcon, MoreVert as MoreVertIcon } from '@material-ui/icons';

import { Skeleton } from '@material-ui/lab';
import DateTimeUtils from '../../../utils/datetime';
import ValidationUtils from '../../../utils/validation';

const useStyles = makeStyles({
    root: {
    
    },
    button: {
      float: 'right'
    },
    actions: {
        textAlign: 'right'
    },
    avatar: {
        width: '100px',
        height: '100px'
    }
});


const UserProfileHeader = (props) => {
    const classes = useStyles();
    const { user, canEdit } = props;

    const navigateRoute = (route) => props.history.push(route);

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                component="img"
                alt={user.name}
                height="300"
                image={ValidationUtils.isEmpty(user.profileImage) ? '/assets/img/no_cover.jpeg' : user.profileImage}
                title={user.name}
                />
                <CardContent>
                    <CardHeader
                        avatar={
                            <Avatar className={classes.avatar} aria-label="recipe" >
                                <img style={{ width: '100%' }} src={
                                    ValidationUtils.isEmpty(user.avatar) ? '/assets/img/no_image.jpeg' : user.avatar 
                                } />
                                
                            </Avatar>
                        }
                        // action={
                        //     <IconButton aria-label="settings">
                        //         <MoreVertIcon />
                        //     </IconButton>
                        // }
                        title={user.name}
                        subheader={DateTimeUtils.getDate(user.createdAt)}
                    />
                    <Typography variant="body2" color="textSecondary" component="p">
                        { user.introContent }
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className={classes.actions}>
                {/* <Button style={{ float: 'right' }} className={classes.button} size="small" color="primary">
                     Chia sẻ
                </Button> */}
               {canEdit && (
                <Button onClick={() => navigateRoute('/user/edit-profile')} size="small" color="secondary">
                    Cập nhật
                </Button>
               )}
            </CardActions>
        </Card>
                
    );
};

export default withRouter(UserProfileHeader);
