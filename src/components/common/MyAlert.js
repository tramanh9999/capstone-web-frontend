import React, { useState, useEffect } from 'react';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';


const MyAlert = (props) => {
    const { content, type, open, setOpen } = props;
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <Snackbar 
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={open} 
            autoHideDuration={2000} 
            onClose={handleClose}>
            <Alert 
                elevation={6} variant="filled" 
                onClose={handleClose} 
                severity={type}>
                {content}
            </Alert>
        </Snackbar>
    );
};



export default MyAlert;
