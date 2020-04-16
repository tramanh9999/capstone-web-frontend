import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';


const ScreensSelect = (props) => {
    const { screens, onChange, value, placeholder } = props;

    return (
        <FormControl size="small" variant="outlined" style={{ width: '100%' }}>
            <InputLabel>{placeholder}</InputLabel>
            <Select
                size="small"
                value={value}
                onChange={onChange}
            >
                {screens.map((screen, index) => (
                    <MenuItem key={screen.id} value={screen.id}>
                        #{index + 1} ({ screen.title.length > 0 ? screen.title : 'Chưa có tiêu đề' })
                    </MenuItem>
                ))}
        </Select>
      </FormControl>
    );
};


export default ScreensSelect;
