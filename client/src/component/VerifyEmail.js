import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { green, grey } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState, useEffect } from 'react';
import logo from '../static/images/logo_1.png';
import API from "../utils/API";
import FormValidator from '../utils/FormValidator';
import { Link, Redirect, withRouter } from "react-router-dom";
const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    root: {
     
    },
    paper: {
        padding: theme.spacing(1, 1),
        margin: theme,
        background: grey[100],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        padding: theme.spacing(2),
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(0),
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
        background: green[500],
        "&:hover": {
            backgroundColor: "green"
        }
    },
}));

export default function ResetPassword(props) {

    const [redirect, setRedirect] = useState(false)
    const [snack, setSnack] = useState({
        open:false,
        error:false,
        message:''
    })
    useEffect(()=>{

        var data = {
            token: props.match.params.token
        }
        API
            .post('auth/verifyEmail', data)
            .then(response =>{
                if(response.data.code == 200){
                    setSnack({
                        open: true,
                        error: false,
                        message: 'Email verified! Redirecting to login page...'

                    })
                }else{
                    setSnack({
                        open: true,
                        error: true,
                        message: 'Invalid code'

                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const handleClose = () =>{
        setSnack({
            open:false
        })
      
        setRedirect(true)
    }
   
if(redirect){

    return (
    <div>  
    <Redirect to={{
        pathname: '/',
    }}></Redirect>
    </div>)
}

    return (
        <div>
            
            <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={snack.open}
            autoHideDuration={2000}
            variant="success"
            message={snack.message}
            onClose={handleClose}
          >

          </Snackbar>
        </div>
    );
}
