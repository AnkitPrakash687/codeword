import { CircularProgress, Divider, Slide } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { green, grey, lightGreen, red } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Typography, SnackbarContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { Component } from 'react';
import { Link, Redirect, withRouter } from "react-router-dom";
import logo from '../static/images/logo_1.png';
import API from "../utils/API";
const useStyles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  root: {

  },
  paper: {
    padding: theme.spacing(1, 2, 1, 2),
    margin: theme.spacing(0, 0, 0, 1),
    margin: theme,
    borderStyle: "solid",
    border: 2,
    borderColor: lightGreen[100],
    background: grey[100],
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  media: {
    height: "auto",
    width: '70%'
  },
  title: {
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
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[700],
    position: 'absolute',
    top: '38%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
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
      error: false,
      loading: false,
      snackcolor: {
        backgroundColor: grey[800]
      }
    }

  }

  render() {

    function handleSubmit(event) {
      // console.log('*********BASE URL************')
      // console.log(process.env)
      event.preventDefault()
      const data = this.state
      this.setState({ ...this.state, loading: true })

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
          //  sessionStorage.setItem('name', response.data.name)
          console.log(response.data)
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
              error: true,
              snackcolor: {
                backgroundColor: red[800]
              }
            })
          }
          this.setState({ ...this.state, loading: false })
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
        error: false
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
      <div
        style={{ background: 'linear-gradient(180deg, #388e3c, #c8e6c9)' }}
        className={classes.root}>

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
                    marginBottom: '1rem'
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
                {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
                <div className={classes.wrapper}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.submit}
                    disabled={this.state.loading}
                  >
                    <Typography component="div">
                      <Box fontWeight="bold">
                        Sign in
                    </Box>
                    </Typography>
                    {this.state.loading ? <CircularProgress size={30} className={classes.buttonProgress} /> : null}
                  </Button>
                </div>

              </form>
              <Grid container>
                <Grid item xs>
                  <Link to="/forgotPassword" variant="body2">
                    Forgot password?
              </Link>
                </Grid>
                <Grid item>
                  <Link to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Divider variant="fullWidth" />
            </Paper>

            <Snackbar
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              TransitionComponent={Slide}
              TransitionProps={
                { direction: "down" }
              }
              style={{
                color: [green]
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
              <SnackbarContent style={this.state.snackcolor}
                message={<span id="client-snackbar">{this.state.message}</span>}
              />
            </Snackbar>

          </Container>

        </Grid>
      </div>
    );


  }
}
export default withRouter(withStyles(useStyles)(SignIn))