import React, { useState, Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {CardMedia} from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"
import API from "../utils/API";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dashboard from './Dashboard';
import { withStyles } from '@material-ui/core/styles';
import history from '../history'
import App from '../App';
import { AppBar } from '@material-ui/core';
import MyAppBar from '../component/MyAppBar'
import {green, grey, lightGreen} from '@material-ui/core/colors'
import logo from '../static/images/logo_1.png'
const useStyles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  root:{
    background: green[500]
  },
  paper: {
    padding: theme.spacing(1, 2, 1, 2),
    margin: theme.spacing(0,0,0,1),
    margin: theme,
    borderStyle:"solid",
    border: 2,
    borderColor: lightGreen[100],
    background: grey[100],
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  media:{
    height: "auto",
    width: '70%'
  },
  title:{
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: green[500],
  },
  form: {
    width: '100%', 
    padding: theme.spacing(2),

  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: green[500],
    "&:hover": {
      backgroundColor: "green"
  }
  },
});


class SignIn extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      message: '',
      error: false
    }
  
  }

  render() {

    function handleSubmit(event) {
      event.preventDefault()
      const data = this.state
      // console.log(data)
      //const validation = validator.validate(state);
      //setState({ validation });
      //console.log(validation)
      //if (validation.isValid) {

      API
        .post(
          'auth/signin', data)
        .then(response => {
          sessionStorage.setItem('token', response.data.token)
          
          // console.log('👉 Returned data:', response);
          console.log(response.data)
          if (response.data.code == 200) {
            this.setState({
              isLoggedIn: true,
            })
            console.log(this.state)
          } else {
            this.setState({
              isLoggedIn: false,
              message: response.data.message,
              error: true
            })
          }
        }).catch(error => {
          console.log('login error', error)
        })
        ;


      //  }

    }

    const handleChange = name => (event) => {
      console.log({ [name]: event.target.value })
      this.setState({ ...this.state, [name]: event.target.value });
      // if([name]=='instructor'){
      //     setState({ ...state, [name]: isChecked });
      // }

    }

    const handleClose = (event) => {
     this.setState({
       error: !this.state.error
     })

    }


    const { classes } = this.props;
  
    if (this.state.isLoggedIn) {
     
      return <Redirect to={{
        pathname: '/',
        email: { id: '123' }
    }}
/>
    }

    return (
      <div className={classes.root}>
         
      <Grid container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}>
        <Container component="main" maxWidth="xs">
         
          <Paper className={classes.paper}>
          <CssBaseline />
          <div className={classes.title}>
          <img 
            className={classes.media}
            src={logo}
          />
          </div>
              <Typography component="h1" variant="h5">
                Sign in
        </Typography>
              <form onSubmit={handleSubmit.bind(this)} className={classes.form} >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  margin="dense"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={this.state.email}
                  style={{
                    marginBottom:'1rem'
                  }}
                  onChange={handleChange('email')}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  margin="dense"
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={handleChange('password')}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submit}
                >
                  <Typography component="div">
                    <Box fontWeight="bold">
                    Sign IN 
                    </Box>
                  </Typography>
                  
          </Button>
               
              </form>
              <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
              </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
          </Paper>
         
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.error}
            autoHideDuration={6000}
            variant="success"
            onClose={handleClose}
            message={this.state.message}
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

        </Container>

      </Grid>
      </div>
    );


  }
}
export default withRouter(withStyles(useStyles)(SignIn))