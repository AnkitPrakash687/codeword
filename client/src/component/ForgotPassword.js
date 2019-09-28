import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import API from "../utils/API";
import FormValidator from '../utils/FormValidator'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom"
import Login from './Login'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import MyAppBar from '../component/MyAppBar'
import { green, grey } from '@material-ui/core/colors'
import logo from '../static/images/logo_1.png'
const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    root: {
        background: green[500]
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

export default function ForgotPassword(props) {

    const classes = useStyles();
    const [email, setEmail] = useState({
        email: ''
    })

    const [success, setSuccess] = useState({
        status: false,
        message: '',
        code: null
    })

    async function handleSubmit(event) {
        event.preventDefault()
        API
            .post('auth/forgotPassword', { email: email.email })
            .then(response => {
                if (response.data.code == 200) {
                    setSuccess({
                        status: true,
                        message: response.data.message,
                    })
                }else{
                    setSuccess({
                        status: true,
                        message: response.data.message,
                    })
                }
            })
        // console.log(data)
        // const validation = validator.validate(state);
        // //setState({ validation });
        // console.log(validation)
        // if (validation.isValid) {
        //      try {
        //         const response = await API.post('auth/signup', data);
        //         console.log('👉 Returned data:', response);
        //         console.log(response.data.code)
        //         if(response.data.code == 200){
        //         setSuccess({
        //             status:true,
        //             message: 'Sign up successful',
        //             code: 200
        //         })
        //     }else if(response.data.code == 400){
        //         setSuccess({
        //             status:true,
        //             message: 'Account already exists',
        //             code: 400
        //         })
        //     }
        //       } catch (e) {
        //         console.log(`😱 Axios request failed: ${e}`);
        //       }
        //     }

    }

    const handleChange = name => (event, isChecked) => {
        //  console.log({[name]: event.target.value})

        if (name == 'email') {
            setEmail({ email: event.target.value })
        }
    }

    function handleClose(event, reason) {
        setSuccess({ status: false })
    }

    const emailValidator = new FormValidator([
        {
            field: 'email',
            method: 'isEmail',
            validWhen: true,
            message: 'That is not a valid email.'
        }
    ])

    let emailValidation = emailValidator.validate(email)

    return (
        <div className={classes.root}>

            <Grid container
                spacing={0}
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Paper className={classes.paper}>

                        <img

                            src={logo}
                            style={{
                                width: '50%',
                                height: 'auto'
                            }}
                        />



                        <Typography component="h1" variant="h5">
                            Reset Password
        </Typography>


                        <form onSubmit={handleSubmit.bind(this)} className={classes.form} >
                            <TextField
                                error={emailValidation.email.isInvalid && email.length > 0 ? true : false}
                                helperText={emailValidation.email.isInvalid && email.length > 0 ? 'Invalid Email' : ''}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                margin="dense"
                                onChange={handleChange('email')}
                                value={email.email}

                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className={classes.submit}
                            >
                                <Typography component="div">
                                    <Box fontWeight="bold">
                                        Send Reset Link
                    </Box>
                                </Typography>
                            </Button>

                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                open={success.status}
                                autoHideDuration={6000}
                                variant="success"
                                onClose={handleClose}
                                message={success.message}
                                action={[
                                    <IconButton
                                        key="close"
                                        aria-label="Close"
                                        color="inherit"
                                        className={classes.close}
                                        onClick={handleClose}
                                    >
                                        <CloseIcon />
                                    </IconButton>,
                                ]}
                            >

                            </Snackbar>
                            <Grid container>
                                <Grid item xs>
                                    <Link to="/signin" variant="body2">
                                        Login
              </Link>
                                </Grid>

                            </Grid>
                        </form>

                    </Paper>
                </Container>
            </Grid>
        </div>
    );
}