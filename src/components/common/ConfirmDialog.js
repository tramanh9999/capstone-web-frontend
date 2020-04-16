import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDialog = (props) => {
    const { openDialog, cancel, ok, setOpenDialog, content } = props;

    return (
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
            {/* <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle> */}
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    { content }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={ok} color="primary">
                    Đồng ý
                </Button>
                <Button onClick={cancel} color="secondary">
                    Hủy bỏ
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default ConfirmDialog;
