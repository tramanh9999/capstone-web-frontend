import React from 'react';
import { Select, MenuItem, TextField, InputLabel, FormControl } from '@material-ui/core';
import ScreensSelect from './ScreensSelect';
import MyDropdownMenu from '../../../components/common/MyDropdownMenu';
import { INFORMATION_TYPES } from '../../../common/constants';

const StoryParameters = (props) => {

    const { storyParameters, parameters, onChangeParam, onAddParamConditions, onRemoveParam, 
        onChangeParamConditions, onRemoveParamCondition, screens } = props;
        

    return (
        <div>
            {storyParameters.length > 0 && (
                <div>
                    <strong className="">Thông tin truyện (tham số)</strong>
                    <div className="card card-body mt-3">
                        {storyParameters.map((param, index) => {
                            const conditions = parameters.find(p => param.type === p.type).conditions;
                            return (    
                               <div key={param.id}>
                                    <div className="row mb-4" key={param.id}>
                                        <div className="col-sm-4 px-1">
                                            <TextField 
                                                size="small"
                                                style={{ width: '100%' }}
                                                variant="outlined"
                                                label="Tên thông tin"
                                                value={param.name} 
                                                onChange={(e) => onChangeParam('name', e.target.value, param)} 
                                                />
                                        </div>
                                        <div className="col-sm-3 px-1">
                                            {/* <label>Kieu thong tin</label> */}
                                            <FormControl size="small" variant="outlined" style={{ width: '100%' }}>
                                                <InputLabel>Kiểu thông tin</InputLabel>
                                                <Select
                                                    defaultValue={parameters[0].type}
                                                    value={param.type}
                                                    onChange={(e) => onChangeParam('type', e.target.value, param)}
                                                >
                                                    {parameters.map(p => (
                                                        <MenuItem value={p.type} key={p.type}>
                                                            {p.type == INFORMATION_TYPES.STRING ? 'CHUỐI KÍ TỰ' : 'SỐ'}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        
                                        </div>
                                        <div className="col-sm-4 px-1">
                                            <TextField 
                                                size="small"
                                                style={{ width: '100%' }}
                                                variant="outlined"
                                                label=""
                                                type={param.type === INFORMATION_TYPES.NUMBER ? "number" : 'text'}
                                                value={param.value} 
                                                onChange={(e) => onChangeParam('value', e.target.value, param)} 
                                            />
                                        </div>
                                        <div className="col-sm-1 px-1">
                                            <MyDropdownMenu>
                                                <MenuItem onClick={() => onAddParamConditions(param)}>
                                                    Thêm điều kiện
                                                </MenuItem>
                                                <MenuItem onClick={() => onRemoveParam(index)}>
                                                    Xóa thông tin
                                                </MenuItem>
                                            </MyDropdownMenu>
                                            
                                        </div>
                                    </div>

                                    {/* parameter conditions */}
                                    { param.conditions.length > 0 && <strong>Điều kiện</strong> }
                                    {param.conditions.map((cond, index) => (
                                        <div className="row mb-2" key={cond.id}>
                                            <div className="col-sm-2 text-center px-1 pt-3">
                                                <strong>{param.name}</strong> 
                                            </div>
                                            <div className="col-sm-2 px-1">
                                            <FormControl size="small" style={{ width: '100%' }}>
                                                <Select
                                                    defaultValue={conditions[0]}
                                                    variant="outlined"
                                                    onChange={(e) => onChangeParamConditions('type', e.target.value, index, param)} 
                                                    value={cond.type}
                                                >
                                                    {conditions.map(c => (
                                                        <MenuItem key={c} value={c}>{c}</MenuItem>
                                                    ))}
                                                    
                                                </Select>
                                            </FormControl>
                                            </div>
                                            <div className="col-sm-3 px-1">
                                                <TextField  
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    variant="outlined"
                                                    value={cond.value}
                                                    onChange={(e) => onChangeParamConditions('value', e.target.value, index, param)} 
                                                    type={param.type === INFORMATION_TYPES.NUMBER ? "number" : 'text'}
                                                />
                                            </div>
                                            <div className="col-sm-4 px-1">
                                                <ScreensSelect
                                                    placeholder={'Đi tới màn kế tiếp'}
                                                    screens={screens}
                                                    value={cond.nextScreenId}
                                                    onChange={(e) => onChangeParamConditions('nextScreenId', e.target.value, index, param)} 
                                                />
                                            </div>
                                        
                                        <div className="col-sm-1 px-1">
                                            <MyDropdownMenu>
                                                <MenuItem onClick={() => onRemoveParamCondition(param, index)}>
                                                    Xóa
                                                </MenuItem>
                                            </MyDropdownMenu>
                                        </div>
                                        </div>
                                    ))}
                               </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};


export default StoryParameters;
