import { Box, LinearProgress, Slide } from '@material-ui/core';
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
import { Link, Redirect } from "react-router-dom";
import logo from '../static/images/logo_1.png';
import API from "../utils/API";
import FormValidator from '../utils/FormValidator';

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

    const classes = useStyles();

    const [state, setState] = useState({
        password: "",
        confirmPass: "",
    })
    const [password, setPassword] = useState('')
    const [passStrength, setPassStrength] = useState({
        value: 0, text: '', color: grey[100]
    })
    const [success, setSuccess] = useState({
        status: false,
        message: '',
        code: null
    })

    const [redirect, setRedirect] = useState()

    useEffect(() => {
        var strongPassRegex = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*_])(?=.{8,})")
        var mediumPassRegex = RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})")
        var weakPassRegex = RegExp('(?=.{6,})')

        if (strongPassRegex.test(password)) {
            setPassStrength({ value: 100, text: 'strong', color: 'primary' })
        } else if (mediumPassRegex.test(password)) {
            setPassStrength({ value: 60, text: 'medium', color: 'primary' })
        } else if (weakPassRegex.test(password)) {
            setPassStrength({ value: 30, text: 'weak', color: 'secondary' })
        } else {
            setPassStrength({ value: 10, text: '', color: grey[100] })
        }
    }, [password])

    function handleSubmit(event) {
        event.preventDefault()
        var data = {
            resetToken: props.match.params.token,
            password: password
        }
        API
            .post('auth/resetPassword', data)
            .then(response => {
                if (response.data.code == 200) {
                    setSuccess({
                        status: true,
                        message: response.data.message,
                        code: 200
                    })

                } else {
                    setSuccess({
                        status: true,
                        message: response.data.message,
                        code: response.data.code
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
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
        //console.log({[name]: event.target.value})
        setState({ ...state, [name]: event.target.value });
        if (name == 'password') {
            setPassword(event.target.value)
        }
    }


    function handleClose(event, reason) {
        if (success.code == 200) {
            setRedirect(true)
            setSuccess({ status: false })
        } else {
            setSuccess({ status: false })
        }
    }

    let passwordMatch = (confirmation, state) => (state.confirmPass && password === confirmation)

    const validator = new FormValidator([
        {
            field: 'confirmPass',
            method: passwordMatch,   // notice that we are passing a custom function here
            validWhen: true,
            message: 'Password and password confirmation do not match.'
        }]
    )

    let validation = validator.validate(state)  //
    if (redirect) {
        return (<Redirect to='/'></Redirect>)
    }


    return (
        <div
            style={{ background: 'linear-gradient(180deg, #388e3c, #c8e6c9)' }}
            className={classes.root}>

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
                                error={(password.length > 0 && passStrength.value < 11) ? true : false}
                                helperText={(password.length > 0 && passStrength.value < 11) ? 'Password should be minimun 6 character' : ''}
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                margin="dense"
                                autoComplete="current-password"
                                onChange={handleChange('password')}
                                value={password}

                            />

                            {passStrength.value > 10 &&
                                <div >
                                    <Grid container style={{ marginBottom: 5 }}>
                                        <Grid item xs={4} sm={4}>
                                            <Box display="flex" flexDirection="row" >

                                                <Typography component="div">
                                                    <Box fontSize={12} fontWeight="italic">
                                                        Password Strength
                                                    </Box>
                                                </Typography>
                                            </Box>
                                            <Box>


                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} sm={6} m={1}>

                                            <LinearProgress
                                                variant="determinate"
                                                value={passStrength.value}
                                                className={classes.passStrengthBar}
                                                color={passStrength.color}
                                            />

                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <Typography style={{ marginLeft: 5 }} component="div">
                                                <Box fontSize={12}>
                                                    {passStrength.text}
                                                </Box>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                            }
                            <TextField
                                error={validation.confirmPass.isInvalid && state.confirmPass.length > 0 ? true : false}
                                helperText={validation.confirmPass.isInvalid && state.confirmPass.length > 0 ? 'Password do not match' : ''}
                                variant="outlined"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirm-password"
                                margin="dense"
                                autoComplete="current-password"
                                onChange={handleChange('confirmPass')}
                                value={state.confirmPass}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className={classes.submit}
                                disabled={
                                    (password.length > 0 && passStrength.value < 11) ||
                                    (validation.confirmPass.isInvalid && state.confirmPass.length > 0)
                                }
                            >
                                <Typography component="div">
                                    <Box fontWeight="bold">
                                        Reset Password
                    </Box>
                                </Typography>
                            </Button>

                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                TransitionComponent={Slide}
                                TransitionProps={
                                    { direction: "right" }
                                }
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
                            <Box display="flex" justifyContent="space-between">
                                <Box display="flex">
                                    <Link to="/signin" variant="body2">
                                        Back to login
                                    </Link>
                                </Box>
                                <Box display="flex">
                                    <Link to="/forgotPassword" variant="body2">
                                        Resend link
                                    </Link>
                                </Box>
                            </Box>
                        </form>

                    </Paper>
                </Container>
            </Grid>
        </div>
    );
}
