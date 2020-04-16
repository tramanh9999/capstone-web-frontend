import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ACTION_TYPES } from '../../../common/constants';

const getActionTitle = (type) => {
    switch(type){
        case ACTION_TYPES.REDIRECT: return 'Truy cập đường dẫn';
        case ACTION_TYPES.NEXT_SCREEN: return 'Chuyển màn hình';
        case ACTION_TYPES.UPDATE_INFORMATION: return 'Cập nhật thông tin';
    }
}

const ActionsSelect = (props) => {
    const { onChange, actionsList, value } = props;
  
    return (
        <FormControl 
            size="small" 
            style={{ width: '100%' }} 
            variant="outlined">
            <InputLabel>Loại hành động</InputLabel>
            <Select
                defaultValue={actionsList[0]}
                value={value}
                onChange={onChange}
            >
                {actionsList.map(action => (
                    <MenuItem 
                        key={action} 
                        value={action}>{ getActionTitle(action) }</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


export default ActionsSelect;
