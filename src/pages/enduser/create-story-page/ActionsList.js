import React from 'react';
import { TextField, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import ScreensSelect from './ScreensSelect';
import ActionsSelect from './ActionsSelect';
import MyDropdownMenu from '../../../components/common/MyDropdownMenu';
import { ACTION_TYPES, INFORMATION_TYPES } from '../../../common/constants';

const ActionsList = (props) => {
    const { actions, onRemoveAction, onChangeActions, 
        actionsList, screens, currentParam, screen } = props;
    return (
        <div>
            {actions.map((action, index) => (
               <div key={action.id}>
                 <div className="row mb-4" >
                    <div className="col-11">
                        <div className="row">
                        <div className="col-sm-6 mb-2">
                            <TextField 
                                size="small"
                                style={{ width: '100%' }}
                                label="Hành động..."
                                variant="outlined"
                                value={action.content} 
                                onChange={(e) => onChangeActions('content', e.target.value, screen, index)}
                            />
                        </div>
                        <div className="col-sm-6 mb-4"> 
                            
                            <ActionsSelect
                                 value={action.type}
                                 onChange={(e) => onChangeActions('type', e.target.value, screen, index)}
                                 actionsList={actionsList}
                            />
                        </div>
                        {(action.type === ACTION_TYPES.UPDATE_INFORMATION && currentParam != null) && (
                            <>
                                <div className="col-sm-4">
                                    {(
                                        <FormControl size="small" style={{ width: '100%' }} variant="outlined">
                                            <InputLabel>Ảnh hưởng</InputLabel>
                                            <Select
                                                defaultValue={currentParam.operations[0]}
                                                value={action.operation}
                                                onChange={(e) => onChangeActions('operation', e.target.value, screen, index)}
                                            >
                                                {currentParam.operations.map(o => (
                                                    <MenuItem key={o.value} value={o.value}>{ o.title }</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </div>
                                <div className="col-sm-4">
                                    <TextField 
                                        size="small"
                                        style={{ width: '100%' }}
                                        variant="outlined"
                                        label="Giá trị tác động..."
                                        type={currentParam.type === INFORMATION_TYPES.NUMBER ? "number" : 'text'}
                                        value={action.value} 
                                        onChange={(e) => onChangeActions('value', e.target.value, screen, index)}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <ScreensSelect
                                        placeholder={'Chọn màn kế tiếp'}
                                        screens={screens}
                                        value={action.nextScreenId}
                                        onChange={(e) => onChangeActions('nextScreenId', e.target.value, screen, index)}/>
                                </div>
                            </>
                        )}

                        {action.type === ACTION_TYPES.NEXT_SCREEN && (
                            <div className="col-sm-6">
                                <ScreensSelect
                                    placeholder={'Chọn màn kế tiếp'}
                                    screens={screens}
                                    value={action.value}
                                    onChange={(e) => onChangeActions('value', e.target.value, screen, index)}
                                />
                            </div>
                        )}

                            {action.type === ACTION_TYPES.REDIRECT && (
                               <div className="col-sm-6">
                                    <TextField 
                                        size="small"
                                        style={{ width: '100%' }}
                                        variant="outlined"
                                        label="Đường dẫn..."
                                        value={action.value} 
                                        onChange={(e) => onChangeActions('value', e.target.value, screen, index)}
                                    />
                               </div>
                            )}
                        </div>
                    </div>

                    <div className="col-1">
                        <MyDropdownMenu>
                            <MenuItem onClick={() => onRemoveAction(screen, index)}>
                                Xóa
                            </MenuItem>
                        </MyDropdownMenu>
                    </div>
                </div>
                    <hr style={{ border: '1px solid #ccc' }} />
               </div>
            )) }
        </div>
    );
};


export default ActionsList;
