import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle as MuiDialogTitle, IconButton, Typography,
    DialogContent as MuiDialogContent, DialogActions as MuiDialogActions  }  from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import StringUtils from '../../../utils/string';
import ValidationUtils from '../../../utils/validation';
import StoryGraph from '../../../components/common/StoryGraph';
import { ACTION_TYPES, SCREEN_COLORS } from '../../../common/constants';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

// const DialogTitle = withStyles(styles)(props => {
//   const { children, classes, onClose, ...other } = props;
//   return (
//     <MuiDialogTitle disableTypography className={classes.root} {...other}>
//       <Typography variant="h6">{children}</Typography>
//       {onClose ? (
//         <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </MuiDialogTitle>
//   );
// });

// const DialogContent = withStyles(theme => ({
//   root: {
//     padding: theme.spacing(2),
//   },
// }))(MuiDialogContent);

// const DialogActions = withStyles(theme => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//   },
// }))(MuiDialogActions);

// const isEqual = (obj1, obj2) => {
  
//   return !Object.keys(obj1).some(prop => {
//     if(ValidationUtils.isEmpty(obj2)) return true;
//     return obj1[prop] !== obj2[prop];
//   });
// }

const getNodesAndEdges = (screens, firstScreenId) => {
  const myedges = [];
  const mynodes = [];

  screens.forEach((s, i) => {
      s.first = false;
      s.ending = false;
      
      const haveNextScreenAction = s.actions.some(a => a.type === ACTION_TYPES.NEXT_SCREEN || a.type === ACTION_TYPES.UPDATE_INFORMATION)
      
      if(haveNextScreenAction){
          s.actions.forEach((a, i) => {
              if(a.type === ACTION_TYPES.NEXT_SCREEN){
                  myedges.push({
                      from: s.id,
                      to: a.value
                  })
              } else if(a.type === ACTION_TYPES.UPDATE_INFORMATION){
                myedges.push({
                      from: s.id,
                      to: a.nextScreenId
                  })
              } 
          })
      } else {
        s.ending = true;
      }

      if(s.id === firstScreenId) {
        s.first = true;
      }

      const newNode = {
          id: s.id,
          title: `#${i + 1}: ${StringUtils.getObjTitle(s)}`,
          label: `#${i + 1}: ${StringUtils.getObjTitle(s)}`,
          // index: i,
          // ending: s.ending,
          // first: s.first,
          color: s.ending ? SCREEN_COLORS.ENDING_SCREEN : (s.first ? SCREEN_COLORS.FIRST_SCREEN: SCREEN_COLORS.NORMAL_SCREEN)
      }

      mynodes.push(newNode);

  });


  return { edges: myedges, nodes: mynodes };
}

const isEqual = (obj1, obj2) => {
  if(ValidationUtils.isEmpty(obj1) || ValidationUtils.isEmpty(obj2)) return false;
  if(Object.keys(obj1) != Object.keys(obj2)) return false;
  return Object.keys(obj1).some(prop => obj1[prop] != obj2[prop]);
}

const StoryPreview = (props) => {
    const { firstScreenId, screens, setCurrentScreen } = props;
    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
      // const newEdges = getEdges();
      // const newNodes = getNodes();

      // console.log('run');
      const data = getNodesAndEdges(screens, firstScreenId);

      //  const isNotEqualNodes = data.nodes.some((n, i) => !isEqual(n, nodes[i]));
      // if(isNotEqualNodes) 

      // const isNotEqualEdges = data.edges.some((e, i) => !isEqual(e, edges[i]));
      // if(isNotEqualEdges) 

      setEdges(data.edges);
      setNodes(data.nodes);
    }, [screens, firstScreenId]);

    

    return (
        <div>
            {/* <Dialog 
                fullScreen={true}
                onClose={onClose} 
                open={open}>
                <DialogTitle onClose={onClose}>
                    { StringUtils.getObjTitle(story) }
                </DialogTitle>
                <DialogContent 
                    style={{ minHeight: '200px' }}
                    dividers>
                   
                </DialogContent>
              
            </Dialog> */}
            <StoryGraph
                setCurrentScreen={setCurrentScreen}
                nodes={nodes}
                edges={edges}
            />
        </div>
    );
};


export default StoryPreview;
