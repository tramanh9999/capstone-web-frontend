import React from 'react';
import { getAnimations, ANIMATIONS } from '../../../common/constants';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const animations = getAnimations();

const AnimationSelect = (props) => {
    const { onChange, animation } = props;

    // const getAnimationTitle = (animation) => {
    //     switch(animation){
    //         case ANIMATIONS.FADE: return 'Phai màu';
    //         case ANIMATIONS.FADE: return 'Phai màu';
    //     }
    // }

    return (
        <FormControl size="small" variant="outlined" style={{ width: '100%' }}>
            <InputLabel>Chọn hiệu ứng màn hình</InputLabel>
            <Select
                value={animation}
                onChange={onChange}
            >
                {animations.map((animation) => (
                    <MenuItem key={animation} value={animation}>
                        {animation}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


export default AnimationSelect;
