import React, { useState } from 'react';

import { MenuItem, TextField, Tooltip, Fab, Paper, Button } from '@material-ui/core';
import { Visibility as VisibilityIcon } from '@material-ui/icons';

import ScreensSelect from './ScreensSelect';
import MyDropdownMenu from '../../../components/common/MyDropdownMenu';
import ActionsList from './ActionsList';
import MyEditor from '../../../components/common/MyEditor';
import ValidationUtils from '../../../utils/validation';

const ScreensList = (props) => {
    
    const { onChangeScreen, onChangeActions, onRemoveScreen, 
        onAddAction, onRemoveAction, onShowScreenPreview } = props;
    const { screens, actionsList, storyParameters, parameters, currentScreen } = props;

    let currentParam = null;
    if(storyParameters.length != 0){
        currentParam = parameters.find(param => param.type === storyParameters[0].type);
    }

    let index = -1;
    if(!ValidationUtils.isEmpty(currentScreen)){
        index = screens.findIndex(s => s.id === currentScreen.id) + 1;
    }

    return (
        <div>
            {(!ValidationUtils.isEmpty(currentScreen)) && (
                // <div className="card screen-card mb-5">
                <Paper>
                    <div className="card-header">
                        <h5 className="mb-4">
                            <span className="mr-3">#{ index }</span>
                            <Tooltip style={{ float: 'right' }} 
                                title="Xem trình diễn màn hình" 
                                placement="top">
                                <Fab 
                                    color="primary" 
                                    style={{ width: '35px', height: '35px' }} 
                                    onClick={onShowScreenPreview}>
                                    <VisibilityIcon />
                                </Fab>
                            </Tooltip>
                        </h5>
                        <div className="row">
                            <div className="col-sm-6">
                                <TextField
                                    size="small"
                                    variant="outlined" 
                                    label="Tiêu đề"
                                    style={{ width: '100%' }}
                                    value={currentScreen.title} 
                                    onChange={(e) => onChangeScreen('title', e.target.value, currentScreen)} />
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <MyEditor 
                            onChange={(value) =>  {
                                onChangeScreen('content', value, currentScreen);
                            }}
                            value={currentScreen.content}
                            placeholder="Nội dung màn hình..."
                        />

                        {currentScreen.actions.length > 0 && <strong className="my-3 d-block">Hành động</strong>}
                        
                        <ActionsList
                            actions={currentScreen.actions}
                            actionsList={actionsList}
                            screens={screens} 
                            screen={currentScreen} 
                            currentParam={currentParam}
                            onRemoveAction={onRemoveAction}
                            onChangeActions={onChangeActions}
                        />

                            <Button  
                                style={{ float: "right", marginTop: '10px' }}
                                onClick={() => onAddAction(currentScreen)}>Thêm hành động</Button>
                            <div className="clearfix"></div>
                        <div className="text-right mt-2">
                            <MyDropdownMenu >
                                {/* <MenuItem onClick={(e) => onAddNextScreen(e, screen)}>Them man hinh</MenuItem> */}
                                <MenuItem onClick={() => onRemoveScreen(currentScreen)}>Xóa màn hình</MenuItem>
                            </MyDropdownMenu>
                        </div>
                    </div>
                </Paper>
                // </div>
            )}
        </div>
    );
};


export default ScreensList;
