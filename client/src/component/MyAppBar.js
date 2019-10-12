import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Link, Grid, Box} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { green, lightGreen, grey } from '@material-ui/core/colors';
import {Redirect} from 'react-router-dom'
import history from '../history'
import API from '../utils/API'
import logo from '../static/images/logo_2.png'
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar:{
    background: green[500]
  },
  button:{
    margin: theme.spacing(0),
    textTransform: 'none'    
  }
}));

export default function MyAppBar(props) {

  const TitleButton = withStyles(theme => ({
    root: {
      backgroundColor: green[500],
      color: grey[100],
      fontSize: 20,
      "&:hover": {
        backgroundColor: green[500]
    }
    },
  }))(Button);
  const classes = useStyles();
  const [disableStudentView, setDisableStudentView] = useState(props.disableStudentView ? true:false)
  const [logout, setLogout] = useState(false)
  const [studentView, setStudentView] = useState(false)
  const [token, setToken] = useState(sessionStorage.getItem('token'))
  const [isInstructor, setIsInstructor] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [name, setName] = useState()
  const handleLogout = () =>{
 
    sessionStorage.clear()
    setLogout(true)
  }

  const handleRedirect = () =>{
 
    setRedirect(true)
  }
 const handleStudentView = () =>{
   setStudentView(true)
 }

 useEffect(()=>{

  console.log(token)
  if(token != null){
  const headers = {
    'token': token
  };

  API.get('dashboard/details', { headers: headers }).then(response => {
    console.log("me***********AppBAr")
    console.log(response.data)
   
          var user = response.data
          setName(user.firstName)
          if(user.role == 'instructor'){
              setIsInstructor(true)
          }
        
        
    })
  }
  },[])
    
    if(logout){
      return <Redirect to="/"></Redirect>
    }else if(studentView){
      sessionStorage.setItem('view', 'instructor')
      history.push('/studentview')
      return <Redirect to="/studentview"></Redirect>
    }else if(redirect){
      // history.push('/')
      // return <Redirect to="/"></Redirect>
    }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>  
        <Grid container>     
          <Typography variant="caption" className={classes.title}>
            <Link underline="none" href='/'>
          {
            window.innerWidth > 500?
            
            <img onClick={handleRedirect}
            className={classes.media}
            style={{
              width:'30%',
              height: 'auto'
            }}
            src={logo}
          />:
          <Box p={0} style={{width:'100%'}} display="flex" flexDirection="row" justifyContent="flex-start"  >
          <img onClick={handleRedirect}
          className={classes.media}
          style={{
            width:'50%',
            height: 'auto'
          }}
          src={logo}
        />
        </Box>
          }
            </Link>
      
          </Typography>
          
            <Grid item xs={12} sm={6}>
            <Box p={1} style={{width:'100%'}} display="flex" flexDirection="row" justifyContent="flex-end"  >
          {token != null &&
          <Box p={1}item>
          <Button
            color="inherit"
            className={classes.button}
          >
            {'Hi '+name}
          </Button>
          </Box>
          }
             {/* {token != null && isInstructor && !disableStudentView &&
              <Box p={2} item>
          <div style={{height: 24, borderLeft: '2px solid', borderColor: green[600]}}></div>
          </Box>
             } */}
          {token != null && isInstructor && !disableStudentView &&
           <Box p={1}item>
          <Button 
          color="inherit"
          onClick={handleStudentView}
          className={classes.button}
          >
            Student View
          </Button>
          </Box>
          }
           {/* {token != null &&
           <div style={{height: 24, borderLeft: '2px solid', borderColor: green[600]}}></div>
           } */}
          {token != null &&
           <Box p={1}item>
          <Button 
          color="inherit"
          className={classes.button}
          onClick={handleLogout}
          >
            Logout
          </Button>
          </Box>
          }
          </Box>
          </Grid>
</Grid>
        </Toolbar>
        
      </AppBar>
    </div>
  );
}