import React from 'react';
import ValidationUtils from '../../utils/validation';
import StringUtils from '../../utils/string';
import { ACTION_TYPES, ANIMATIONS } from '../../common/constants';
import { Grow, Fade, Collapse, Zoom, Slide } from '@material-ui/core';

const ScreenShow = (props) => {

    const { screen, onSelectAction, showScreen, animation } = props;
    
    let animationEle;

    switch(animation){
        case ANIMATIONS.FADE: 
            animationEle = <Fade></Fade>
            break;
        case ANIMATIONS.GROW: 
            animationEle = <Grow></Grow>
            break;
        case ANIMATIONS.COLLAPSE: 
            animationEle = <Collapse></Collapse>
            break;
        case ANIMATIONS.SLIDE: 
            animationEle = <Slide></Slide>
            break;
        case ANIMATIONS.ZOOM: 
            animationEle = <Zoom></Zoom>
            break;
        default: animationEle = <Fade></Fade>
    }

    return (
        <div>
            {!ValidationUtils.isEmpty(screen) && (
                React.cloneElement(animationEle, {
                    timeout: { enter: 1000, exit: 1000 },
                    in: showScreen
                }, (
                    <div className="screen-card">
                        <div className="screen-card-header">
                            <h5 className="text-center">{ StringUtils.getObjTitle(screen) }</h5>
                        </div>
                        <div className="screen-card-body" style={props}>
                            <div className="">
                               { StringUtils.parseHtml(screen.content) }
                            </div>
                            <br/>
                            <div className="row">
                                {screen.actions.map(action => (
                                    <div 
                                        className={`${screen.actions.length > 1 ? 'col-sm-6' : 'col-12'}`} 
                                        key={action.id}>
                                        <div 
                                            style={{ fontSize: '1.2em' }}
                                            onClick={() => onSelectAction(action)}
                                            className="action-content text-center">
                                                
                                            {action.type === ACTION_TYPES.REDIRECT && (
                                                <a href={action.value} target="_blank">
                                                    { action.content }
                                                </a>
                                            )}
                                            {action.type !== ACTION_TYPES.REDIRECT && (
                                                <>{ StringUtils.parseHtml(action.content)  }</>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                
                ))
            )}
        </div>
    );
};


export default ScreenShow;
