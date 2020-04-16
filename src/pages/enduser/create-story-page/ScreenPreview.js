import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle as MuiDialogTitle, IconButton, Typography,
    DialogContent as MuiDialogContent, DialogActions as MuiDialogActions, Slide  }  from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import StringUtils from '../../../utils/string';
import ValidationUtils from '../../../utils/validation';
import ScreenShow from '../../../components/common/ScreenShow';
import AnimationSelect from './AnimationSelect';
import MyFullScreenShowWrapper from '../../../components/common/MyFullScreenShowWrapper';


const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  screenShow: {
   
  },
  fullHeight: {
    height: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ScreenPreview = (props) => {
    const { open, onClose, screen, animation, changeStory } = props;
    const [showScreen, setShowScreen] = useState(true);
    const classes = withStyles(styles)
    
    const toggleScreen = () => {
      if(showScreen){
        setShowScreen(false)
      } else {
        setShowScreen(true);
      }
    }

    return (
        <div>
            {!ValidationUtils.isEmpty(screen) && (
                <Dialog 
                  fullScreen
                  // fullWidth={true}
                  // maxWidth={'sm'}
                  TransitionComponent={Transition}
                  onClose={onClose} 
                  open={open}>
                    <DialogTitle id="customized-dialog-title" onClose={onClose}>
                        { StringUtils.getObjTitle(screen) }
                    </DialogTitle>
                    <DialogContent 
                      style={{ minHeight: '100vh', padding: 0, fontSize: 'inherit' }}
                      dividers>
                        <MyFullScreenShowWrapper>
                            <ScreenShow 
                                  animation={animation}
                                  showScreen={showScreen}
                                  screen={screen}
                                  onSelectAction={() => {}}
                              />
                              <div className="clearfix"></div>
                        </MyFullScreenShowWrapper>
                        
                    </DialogContent>
                    <DialogActions>
                        <div className="float-right" style={{ width: '200px' }}>
                          <AnimationSelect 
                            animation={animation}
                            onChange={changeStory}
                          />
                        </div>
                        <Button onClick={toggleScreen} color="primary">
                            {showScreen ? 'Ẩn màn hình' : 'Hiện màn hình'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};


export default ScreenPreview;
