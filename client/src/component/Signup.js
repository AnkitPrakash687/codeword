import { LinearProgress, SnackbarContent, Slide } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { green, grey, red, lightGreen } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
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
  passStrengthBar: {
    marginTop: 8,
  }
}));

export default function Signup() {

  const classes = useStyles();
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmPass: "",
    instructor: false
  })
  const [passStrength, setPassStrength] = useState({
    value: 0, text: '', color: grey[100]
  })
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState({
    status: false,
    message: '',
    code: null,
    snackcolor: {
      backgroundColor: grey[800]
    }
  })
  const [redirect, setRedirect] = useState(false)
  async function handleSubmit(event) {
    event.preventDefault()
    const data = state
    // console.log(data)
    const validation = validator.validate(state);
    //setState({ validation });
    console.log(validation)
    if (validation.isValid) {
      try {
        const response = await API.post('auth/signup', data);
        console.log('👉 Returned data:', response);
        console.log(response.data.code)
        if (response.data.code == 200) {
          setSuccess({
            status: true,
            message: response.data.message,
            code: 200,
            snackcolor: {
              backgroundColor: lightGreen[800]
            }
          })
          sessionStorage.setItem('token', response.data.token)
        } else if (response.data.code == 400) {
          setSuccess({
            status: true,
            message: 'Account already exists',
            code: 400,
            snackcolor: {
              backgroundColor: red[800]
            }
          })
        }
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
      }
    }

  }

  const handleChange = name => (event, isChecked) => {
    console.log({ [name]: event.target.value })
    setState({ ...state, [name]: event.target.value });
    if ([name] == 'instructor') {
      setState({ ...state, [name]: isChecked });
    }

    if ([name] == 'password') {
      setPassword(event.target.value)
    }

  }

  function handleClose(event, reason) {
    setSuccess({ status: false })
    setRedirect(true)
  }

  let passwordMatch = (confirmation, state) => (state.confirmPass && password === confirmation)

  const validator = new FormValidator([

    {
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'That is not a valid email.'
    },
    {
      field: 'confirmPass',
      method: passwordMatch,   // notice that we are passing a custom function here
      validWhen: true,
      message: 'Password and password confirmation do not match.'
    }]
  )


  let validation = validator.validate(state)  //

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

  // if(redirect && sessionStorage.getItem('token')){
  //   return <Redirect to={{
  //     pathname: '/'
  //   }}
  //   />
  // }

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
              Sign UP
        </Typography>
            <form onSubmit={handleSubmit.bind(this)} className={classes.form} >

              <TextField className={classes.textField}
                variant="outlined"
                required
                fullWidth
                id="first-name"
                label="First Name"
                name="firstName"
                autoFocus
                margin="dense"
                onChange={handleChange('firstName')}
                value={state.firstName}
              />

              <TextField
                variant="outlined"
                required
                fullWidth
                id="last-name"
                label="Last Name"
                name="lastName"
                margin="dense"
                onChange={handleChange('lastName')}
                value={state.lastName}

              />

              <TextField
                error={validation.email.isInvalid && state.email.length > 0 ? true : false}
                helperText={validation.email.isInvalid && state.email.length > 0 ? 'Invalid Email' : ''}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                margin="dense"
                onChange={handleChange('email')}
                value={state.email}

              />
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
                onChange={handleChange('confirmPass')}
                value={state.confirmPass}
              />
              <FormControlLabel
                control={<Checkbox onChange={handleChange('instructor')} value="instructor" color="primary" />}
                label="Request Instructor Account"

              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
                disabled={passStrength.value < 11 ||
                  validation.confirmPass.isInvalid ||
                  validation.email.isInvalid

                  ? true : false}
              >
                <Typography component="div">
                  <Box fontWeight="bold">
                    Sign UP
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
                autoHideDuration={3000}
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
                <SnackbarContent style={success.snackcolor}
                  message={<span id="client-snackbar">{success.message}</span>}
                />

              </Snackbar>
              <Grid container>
                <Grid item xs>
                  <Link to="/signin" variant="body2">
                    Already have an Account?Login
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