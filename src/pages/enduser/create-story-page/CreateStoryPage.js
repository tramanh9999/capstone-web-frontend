import React, { useState, useContext, useCallback } from 'react';
import { Prompt } from 'react-router-dom';
import { TextField, Tooltip, Fab, Checkbox, FormControlLabel, Button, Paper } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Add as AddIcon, CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import MainLayout from '../../../layouts/main-layout/MainLayout';

import StoryParameters from './StoryParameters';
import ScreensList from './ScreensList';
import ScreensSelect from './ScreensSelect';
import ScreenSnapshots from './ScreenSnapshots';
import MyDropdownMenu from '../../../components/common/MyDropdownMenu';
import MyAlert from '../../../components/common/MyAlert';
import MySpinner from '../../../components/common/MySpinner';
import MyEditor from '../../../components/common/MyEditor';
import NotFound from '../../../components/common/NotFound';
import MyBackdrop from '../../../components/common/MyBackdrop';
import TagsSelect from '../../../components/common/TagsSelect';
import MyUploadImage from '../../../components/common/MyUploadImage';
import StoryPreview from './StoryPreview';
import ScreenPreview from './ScreenPreview';
import AnimationSelect from './AnimationSelect';
import StoryTabs from './StoryTabs';
import { LayoutContext } from '../../../context/layout.context';


import { getParameters, getActions, ANIMATIONS, ACTION_TYPES, 
    INFORMATION_TYPES  }  from '../../../common/constants';


import StoryService from '../../../services/story.service';
import TagService from '../../../services/tag.service';
import ValidationUtils from '../../../utils/validation';
import StringUtils from '../../../utils/string';
import FileUtils from '../../../utils/file';
import { getAuthUserInfo } from '../../../config/auth';
import ScreenTypes from './ScreenTypes';
import FIleService from '../../../services/file.service';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const parameters = getParameters();

const actions = getActions();
let isEditPage;

const CreateStoryPage = (props) => {
   
    isEditPage = props.location.pathname !== '/stories/create';

    const layoutContext = useContext(LayoutContext)
    const { setOpenSidebar } = layoutContext

    const [story, setStory] = useState({
        title: '',
        intro: '',
        animation: ANIMATIONS.FADE,
        published: false,
        firstScreenId: ''
    });

    const [isLoadingStory, setLoadingStory] = useState(false);
    const [notfoundStory, setNotfoundStory] = useState(false);
    const [isSaveStory, setSaveStory] = useState(true);

    const [screens, setScreens] = useState([]);
    const [storyParameters, setStoryParameters] = useState([]);
    const [currentScreen, setCurrentScreen] = useState(null);
    const [alert, setAlert] = useState({ content: '', type: 'success', open: false });
    const [openScreenPreview, setOpenScreenPreview] = useState(false);
    const [screenSnapshotsPage, setScreenSnapshotsPage] = useState({ page: 1 });
    const [openStoryPreview, setOpenStoryPreview] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [storyTab, setStoryTab] = useState(0);
    const [image, setImage] = useState(null);

    const [dialog, setDialog] = useState({ content: '', open: false });

    let canChangeScreenContent = true;


    React.useEffect(() => {
        getTags();

        if(isEditPage){
            getStoryDetails();
        } else {
            handleAddScreen();
            setSaveStory(false);
        }
        setOpenSidebar(false);

        return () => {
            setOpenSidebar(true);
            
        }
        // window.onbeforeunload = confirmBeforeLeavePage;
       
    }, []);

    const confirmBeforeLeavePage = (e) => {
        if(!e) e = window.event;
        //e.cancelBubble is supported by IE - this will kill the bubbling process.
        e.cancelBubble = true;
        e.returnValue = 'Có thể bạn cần lưu lại những thay đổi trên câu truyện. \nBạn có chắc muốn rời khỏi trang này hay không?'; //This is displayed on the dialog
    
        //e.stopPropagation works in Firefox.
        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    const getTags = async () => {
        try {
            const res = await TagService.getTags();
            setTags(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getStoryDetails = async () => {
        const { storyId } = props.match.params;
        setLoadingStory(true);
        setOpenBackdrop(true);
        try {
            const res = await StoryService.getReadingStory(storyId);
            console.log(res);
            if(!ValidationUtils.isEmpty(res.data.data)){
                const user = getAuthUserInfo();
                if(user.id !== res.data.data.userId){
                    return props.history.push('/stories/details/' + storyId);
                } else {
                    setSaveStory(false);
                }

                let { screens, informations, informationActions, tags } = res.data.data;

                if(informations.length > 0){
                    screens.forEach(screen => {
                        screen.actions.forEach(action => {
                            if(action.type === ACTION_TYPES.UPDATE_INFORMATION){
                                const ia = informationActions.find(ia => ia.actionId === action.id);
                                if(ia != null) action.operation = ia.operation;
                            }
                        })
                    });
                }


                setScreens(screens);
                console.log(tags);
                setSelectedTags(tags);
                setStoryParameters(informations);
                setStory({  ...res.data.data, screens: null, informations: null, informationActions: null });
                
            } else {
                setNotfoundStory(true);
            }
        } catch (error) {
            console.log(error);
        }
        setOpenBackdrop(false);
        setLoadingStory(false);
    }

    const changeStory = async (prop, value) => {
        if(prop === 'image'){
            if(FileUtils.isFileImage(value)){
                setImage(value);
               try {
                    value = await FileUtils.toBase64(value);
               } catch (error) {
                   console.log(error);
               }
               setStory({ ...story, [prop]: value });
            } else {
                setImage(null);
                setStory({ ...story, image: '' });
            }
        } else {
            setStory({ ...story, [prop]: value });
        }
    }

    const handleAddScreen = () => {
        const newScreen = {
            id: Math.random().toString(),
            title: '',
            content: '', 
            actions: [],
            nextScreenId: '',
        };
        screens.push(newScreen);
        setScreens([...screens]);

        if(screens.length == 1) {
            setCurrentScreen(newScreen);
            changeStory('firstScreenId', newScreen.id);
        }
    }

    const changeScreen = (prop, value, screen) => {
        if(prop === 'content' && !canChangeScreenContent) return;
        screen[prop] = value;
        setScreens([...screens]);
        canChangeScreenContent = true;
    }

    const handleRemoveScreen = async (screen) => {
        const newscreens = screens.filter(sec => sec.id !== screen.id);
        if(currentScreen === screen){
            window.setTimeout(() => setCurrentScreen(null), 0)
        }
        setScreens(newscreens);
    }

    const changeActions = (prop, value, screen, actionIndex) => {
        screen.actions.forEach((opt, index) => {
            if(index == actionIndex){
                opt[prop] = value;
            } 
        }) 
        setScreens([...screens]);
    }

    const handleAddActions = (screen) => {
        const newaction = {
            id: Math.random().toString(),
            content: '',
            type: ACTION_TYPES.REDIRECT,
            operation: '',            
            value: '',
            nextScreenId: ''
        }
        
        screen.actions.push(newaction);
        setScreens([...screens]);
    }

    const handleRemoveAction = (screen, index) => {
        screen.actions.splice(index, 1);
        setScreens([...screens]);
    } 

    const changeParam = (prop, value, param, cond) => {
        param[prop] = value;
        setStoryParameters([...storyParameters]);
    }
    
    const addParameter = () => {
        if(storyParameters.length > 0) {
            setAlert({ 
                content: 'Chỉ thêm được 1 thông tin!', 
                type: 'error', 
                open: true 
            });
        } else {
            const newParam =  {
                id: Math.random().toString(),
                type: INFORMATION_TYPES.NUMBER, //string, number, date,
                name: '',
                value: 100,
                conditions: []
            };
            setStoryParameters([newParam])
        }
    }

    const removeParam = (index) => {
        storyParameters.splice(index, 1);
        setStoryParameters([...storyParameters]);
    }

    const addParamConditions = (param) => {
        param.conditions.push({
            id: Math.random().toString(),
            type: '>',
            value: 0,
            nextScreenId: '1'
        });
        setStoryParameters([...storyParameters]);
    }

    const changeParamConditions = (prop, value, condIndex, param) => {
        param.conditions[condIndex][prop] = value;
        setStoryParameters([...storyParameters]);
    }

    const removeParamCondition = (param, condIndex) => {
        param.conditions.splice(condIndex, 1);
        setStoryParameters([...storyParameters]);
    }

    const closeScreenPreview = () => setOpenScreenPreview(false);

    const saveStoryImage = () => {
        console.log(image);
    }

    const handleDeleteStory = () => {
        setDialog({
            open: true,
            content: 'Bạn có chắc muốn xóa truyện này chứ?'
        })
    }

    const deleteStory = async () => {
        setDialog({ ...dialog, open: false })
        try {
          const res = await StoryService.deleteStory(story.id);
          const { success, errors } = res.data;
          if(success){
            setAlert({ type: 'success', content: 'Xóa thành công', open: true });
            window.setTimeout(() => props.history.push(`/user/my-profile`), 2000);
          } else {
            setAlert({ type: 'error', content: Object.values(errors)[0], open: true });
          }
        } catch (error) {
          console.log(error);
        }
        closeAlert();
    }

    const saveStory = async () =>  {
        setOpenBackdrop(true);
        //upload image if exist
        if(FileUtils.isFileImage(image)){
            try {
             const res = await FIleService.uploadImage(image);
             console.log(res);
             if(res.data.status == 200){
                story.image = res.data.data.link;
                setStory({ ...story });
                //  const res = await StoryService.updateStoryImage(res.data.id, imageLink);
             }
            } catch (error) {
                console.log(error);
            }
        }

        let informationActions = [];

        if(storyParameters.length > 0){
            screens.forEach((screen, i) => {
                screen.myIndex = i + 1;
                screen.actions.forEach((action, index) => {
                    action.myIndex = index + 1;
                    if(action.type === ACTION_TYPES.UPDATE_INFORMATION){
                        informationActions.push({
                            actionId: action.id,
                            informationId: storyParameters[0].id,
                            value: action.value,
                            operation: action.operation
                        })
                    }
                })
            });
        }
        
        story.screens = screens;
        story.tags = selectedTags.map(t => t.id);
        story.informations = storyParameters;
        story.informationActions = informationActions;
        
        console.log(story);

        try {
            let res = null;
            if(isEditPage){
                res = await StoryService.updateStory(story);
            } else {
                res = await StoryService.createStory(story);
            }
            console.log(res);
            const { success, data, errors } = res.data;

            if(success) {
                
                setAlert({ 
                    content: 'Lưu thành công', 
                    type:'success',
                    open: true
                });

                if(!isEditPage){
                    window.setTimeout(() => window.location.href = `/stories/edit/${data.id}`, 2000);
                }
            } else {
                setAlert({ content: Object.values(errors), type:'error', open: true });
            }
        } catch (error) {
            if(!ValidationUtils.isEmpty(error.response)){
                setAlert({ content: Object.values(error.response.data)[0], type:'error', open: true });
            } else {
                setAlert({ content: 'Không thể lưu truyện', type:'error', open: true });
            }
           
        }
        setOpenBackdrop(false);
        closeAlert();
    }

    const closeAlert = () => window.setTimeout(() => setAlert({ ...alert, open: false }), 3000);

    // console.log(storyParameters);
    let actionTypesList = actions.filter(action => {
        if(action === ACTION_TYPES.UPDATE_INFORMATION && ValidationUtils.isEmpty(storyParameters)) return false;
        return true;
    });

    const findScreenById = (id) => screens.find(s => s.id === id);

    // const screenSnapshots = screens.filter((s, index) => {
    //     return index >= (screenSnapshotsPage.page - 1) * 10 && index < screenSnapshotsPage.page * 10;  
    // });
    
    // const numOfPageScreenSnapshots = Math.ceil(screens.length / 10);

    return (
        <MainLayout>
    
            <h3 className="text-center my-4">
                {!isEditPage ? 'Tạo truyện cho riêng bạn' : 'Cập nhật truyện'}
            </h3>
            
            <MyBackdrop open={openBackdrop} setOpen={setOpenBackdrop}/>
            {/* <MySpinner/> */}

            <Prompt
                when={!isSaveStory}
                message={location => {
                    return `Có thể bạn cần lưu lại những thay đổi trên câu truyện!! \nBạn có chắc muốn rời khỏi trang này hay không?`
                }}
            />

            {(!isLoadingStory && !notfoundStory && !ValidationUtils.isEmpty(story)) && (
                <div style={{ marginBottom: '150px' }}>
                     <StoryTabs
                        value={storyTab}
                        onChange={(e, value) => setStoryTab(value)}
                    >
                        {storyTab === 0 && (
                            <div className="container">
                                <div className="row mb-4">
                                    <div className="col-md-9 mx-auto">
                                        {/* Story */}
                                        <Paper >
                                            <div className="card-header">
                                                <div className="row">
                                                  
                                                    <div className="col-sm-7">
                                                        <div className="row">
                                                            <div className="col-sm-12 mb-4">
                                                                <TextField 
                                                                    size="small"
                                                                    variant="outlined"
                                                                    style={{ width: '100%' }}
                                                                    label="Tiêu đề truyện..."
                                                                    value={story.title} 
                                                                    onChange={(e) => changeStory('title', e.target.value)} />
                                                            </div>
                                                            <div className='col-sm-6'>
                                                                <ScreensSelect
                                                                    placeholder={'Chọn màn hình đầu tiên'}
                                                                    screens={screens}
                                                                    value={story.firstScreenId}
                                                                    onChange={(e) => changeStory('firstScreenId', e.target.value)} 
                                                                />
                                                            </div>

                                                            <div className='col-sm-6'>
                                                                <AnimationSelect
                                                                    animation={story.animation}
                                                                    onChange={(e) => changeStory('animation', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-sm-12 my-4">
                                                                <TagsSelect
                                                                    tags={tags}
                                                                    selectedTags={selectedTags}
                                                                    setSelectedTags={(tags) => setSelectedTags([...tags])}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-5">
                                                        <div className="">
                                                            <div>
                                                                <label 
                                                                    for="files" 
                                                                    class="btn btn-block">Chọn ảnh</label>
                                                                <input 
                                                                    id="files" 
                                                                    style={{ visibility:"hidden" }} 
                                                                    accept=".jpg, .gif, .png, .jpeg"
                                                                    onChange={(e) => changeStory('image', e.target.files[0])}
                                                                    type="file"/>
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <img src={story.image} style={{ maxWidth: '150px' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                                    
                                                <StoryParameters 
                                                    parameters={parameters}
                                                    storyParameters={storyParameters}
                                                    screens={screens}
                                                    onChangeParam={changeParam} 
                                                    onAddParamConditions={addParamConditions} 
                                                    onChangeParamConditions={changeParamConditions} 
                                                    onRemoveParamCondition={removeParamCondition}
                                                    onRemoveParam={removeParam} />
                                                
                                            </div>
                                            <div className="card-body">
                                                <MyEditor
                                                    placeholder="Nội dung giới thiệu"
                                                    value={story.intro}
                                                    onChange={(value) => changeStory('intro', value)}
                                                />
                                                
                                                <div className="text-right mt-2">
                                                    <Button
                                                        onClick={addParameter}
                                                        color="primary"
                                                        varient="outlined">Thêm thông tin</Button>
                                                </div>
                                            </div>
                                        </Paper>
                                        {/* <div className="row">
                                            <div className="col-8 mx-auto">
                                                <MyUploadImage/>
                                            </div>
                                        </div> */}
                                        <div className="mb-5">
                                            <FormControlLabel
                                                control={<Checkbox
                                                    checked={story.published}
                                                    color="primary"
                                                    onChange={e => changeStory('published', e.target.checked)}
                                                />}
                                                label="Xuất bản truyện"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {storyTab === 1 && (
                            <div className="row">
                                <div className="col-sm-5 px-1">
                                    <h3 style={{ fontSize: '1.2em' }}>
                                        <span className="mr-2">Tất cả màn hình ({screens.length})</span>
                                        <Tooltip title="Thêm màn hình" aria-label="add" placement="top">
                                            <Fab 
                                                color="primary" 
                                                style={{ width: '35px', height: '35px' }} 
                                                onClick={handleAddScreen}>
                                                <AddIcon />
                                            </Fab>
                                        </Tooltip>
                                    
                                    </h3>
                                    <hr style={{ border: '1px solid #ccc' }} />
                                    
                                    {/* <Pagination 
                                        count={numOfPageScreenSnapshots} 
                                        page={screenSnapshotsPage.page}
                                        color="primary" 
                                        onChange={(e, value) => setScreenSnapshotsPage({ page: value })} 
                                        size="small" />

                                    <ScreenSnapshots
                                        page={screenSnapshotsPage.page}
                                        screens={screenSnapshots}
                                        setCurrentScreen={(id) => {
                                            canChangeScreenContent = false;
                                            setCurrentScreen(findScreenById(id));
                                        }}
                                        currentScreen={currentScreen}
                                        onRemoveScreen={id => handleRemoveScreen(findScreenById(id))}
                                    /> */}
                                    <StoryPreview
                                        firstScreenId={story.firstScreenId}
                                        setCurrentScreen={(id) => {
                                            canChangeScreenContent = false;
                                            setCurrentScreen(findScreenById(id));
                                        }}
                                        screens={screens}
                                        onClose={() => setOpenStoryPreview(false)}
                                        open={openStoryPreview}
                                    />

                                    <br/>
                                    <ScreenTypes/>
                                
                                </div>
                                <div className="col-sm-7">
                                    <h3 style={{ fontSize: '1.2em' }}>Chi tiết màn hình</h3>
                                    <hr style={{ border: '1px solid #ccc' }} />
                                    {/* Story screens */}
                                    <ScreensList
                                        currentScreen={currentScreen}
                                        screens={screens} 
                                        parameters={parameters}
                                        actionsList={actionTypesList} 
                                        storyParameters={storyParameters}
                                        onShowScreenPreview={() => setOpenScreenPreview(true)}
                                        onChangeScreen={changeScreen} 
                                        onChangeActions={changeActions} 
                                        onRemoveScreen={handleRemoveScreen} 
                                        onAddAction={handleAddActions} 
                                        onRemoveAction={handleRemoveAction}
                                    />
                                </div>
                            </div>
                        )}
                    </StoryTabs>
                    {isEditPage && (
                        <button 
                            className="btn btn-danger float-right" 
                            onClick={() => handleDeleteStory()}>
                            Xóa truyện</button>
                    )}
                    <button 
                        className="btn btn-warning float-right" 
                        onClick={() => saveStory()}>
                        Lưu truyện</button>
                
                    <MyAlert 
                        open={alert.open}
                        setOpen={(open) => setAlert({ ...alert, open: open })}
                        type={alert.type}
                        content={alert.content}
                    />

                    {isEditPage && (
                        <ConfirmDialog
                            openDialog={dialog.open}
                            cancel={() => setDialog({ ...dialog, open: false })}
                            ok={deleteStory}
                            setOpenDialog={() => setDialog({ ...dialog, open: true })}
                            content={dialog.content}
                        />
                    )}

                    <ScreenPreview 
                        animation={story.animation}
                        open={openScreenPreview}
                        onClose={closeScreenPreview}
                        screen={currentScreen}
                        changeStory={(e) => changeStory('animation', e.target.value)}
                    />
                </div>
            )}

            { (notfoundStory) && <NotFound message={"Không tìm thấy truyện này"} /> }
           
        </MainLayout>
    
       
    );
};



export default CreateStoryPage;
