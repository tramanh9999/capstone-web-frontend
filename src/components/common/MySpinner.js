import React from 'react';
import { CircularProgress } from '@material-ui/core';

const MySpinner = () => {
    return (
        <div className="text-center">
            <CircularProgress 
                color="secondary" />
        </div>
    );
};


export default MySpinner;
