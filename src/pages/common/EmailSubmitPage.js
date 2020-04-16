import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserService from "../../services/user.service";
import MyAlert from '../../components/common/MyAlert';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MainLayout from "../../layouts/main-layout/MainLayout";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MySpinner from '../../components/common/MySpinner';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const LoginPage = () => {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [ok, setOk] = useState("");
  const [alert, setAlert] = useState({ open: false, type: 'success', content: '' });
  
const [isSendMail, setIsSendMail] = useState(false);


  const forgotPassword = async (e) => {
    e.preventDefault();
    try {
      
      setIsSendMail(true);

      const res = await UserService.forgotPassword(email.trim());
setErrorMessage("Bạn sẽ sớm nhận được một email hướng dẫn .Nếu bạn vẫn cần hỗ trợ, hãy liên hệ qua mail: storyartcapstone@gmail.com")
      console.log(res.data);
    
    } catch (error) {


      var err;
      if (typeof error.response.data.errors != "undefined") {
        err = error.response.data.errors[0].defaultMessage;
      } else if (typeof error.response.data.message == "string") {
        err = error.response.data.message;
      }
      // setAlert({
      //   type: 'error',
      //   content: err,
      //   open: true
      // });
      setErrorMessage(err)
      
    closeAlert();
  }
  setIsSendMail(false)
}

  const closeAlert = () => window.setTimeout(() => setAlert({ ...alert, open: false }), 2000);



 

    return (

   <MainLayout>
      <div className="pt-5">
        {/* <h3 className="text-center text-bold">D</h3> */}
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h3" variant="h3" style={{margin: "40px 0px"}}>
            Quên mật khẩu
              </Typography>


              <h4>{errorMessage}</h4>

            <form className={classes.form}noValidate onSubmit={forgotPassword}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
            //   value={user.username}
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            {isSendMail? <MySpinner/> : 
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Gửi hướng dẫn
              </Button>
}
            </form>



           
          
          
          </div>
        </Container>
  
        <MyAlert
          open={alert.open}
          setOpen={() => setAlert({ ...alert, open: true })}
          type={alert.type}
          content={alert.content}
        />
      </div>
      </MainLayout>
    );
};


export default LoginPage;

