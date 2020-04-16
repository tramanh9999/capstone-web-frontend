import React from 'react';
import { SCREEN_COLORS } from '../../../common/constants';

const ScreenTypes = () => {
    return (
        <>
            <div>
                <span 
                    className="screen-box" 
                    style={{  background: SCREEN_COLORS.FIRST_SCREEN }}></span> Màn hình đầu tiên
            </div>
            <div>
                <span 
                    className="screen-box" 
                    style={{  background: SCREEN_COLORS.NORMAL_SCREEN }}></span> Màn hình nội dung
            </div>
            <div>
                <span 
                    className="screen-box" 
                    style={{  background: SCREEN_COLORS.ENDING_SCREEN }}></span> Màn hình kết thúc
            </div>
        </>
    );
};


export default ScreenTypes;
