import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Link, Grid, Box, Tooltip, Fab} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { green, lightGreen, grey } from '@material-ui/core/colors';
import {Redirect} from 'react-router-dom'
import history from '../history'
import API from '../utils/API'
import logo from '../static/images/logo_2.png'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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
  },
  navTool:{
    margin: theme.spacing(1)
  },
  backButton:{   
   
    "&:hover": {
      backgroundColor: green[500]
  },
    
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
  const [response, setResponse] = useState()
  const [name, setName] = useState()
  const [view, setView] = useState()
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
  if(window.innerWidth > 500){
    setResponse({
      logoAlignment: 'flex-end',
    })
  }else{
    setResponse({
      logoAlignment: 'flex-start',
    })
  }
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
              setView('instructor')

          }
        
        
    })
  }
  },[])

  const handleBackButton = () => {
    setRedirect(true)
}
    
    if(logout){
      return <Redirect to="/"></Redirect>
    }else if(studentView){
      sessionStorage.setItem('view', 'instructor')
      history.push('/studentview')
      return <Redirect to="/studentview"></Redirect>
    }else if(redirect){
      // history.push('/')
      // return <Redirect to="/"></Redirect>
      var value
      if(props.from == "course"){
        value = 0
      }else{
        value = 1
      }
      history.push('/', {value: value})
      return <Redirect to="/"></Redirect>
    }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>

        <Toolbar>  
        <Grid container>
           
          <Typography variant="caption" className={classes.title}>
          {
            
          } 
          
          {
            window.innerWidth > 500?
            <Box style={{width:'100%'}} display="flex" flexDirection="row" justifyContent="flex-start"   >
             {props.backButton && view == "instructor" &&
          
            <Tooltip title="Back to dasboard">
              <IconButton
              size="small"
                className={classes.backButton}
                onClick={handleBackButton}
              >
                <ArrowBackIosIcon fontSize="large" />
              </IconButton>
          </Tooltip>
     
          }
          <Link underline="none" href='/'>
          <img onClick={handleRedirect}
          className={classes.media}
          style={{
            width:'40%',
            height: 'auto'
          }}
          src={logo}
        />
        </Link>
        </Box>:
          <Box style={{width:'100%'}} display="flex" flexDirection="row" justifyContent="flex-start"   >
             {props.backButton && view == "instructor" &&
          
            <Tooltip title="Back to dasboard">
              <IconButton
              size="small"
                className={classes.backButton}
                onClick={handleBackButton}
              >
                <ArrowBackIosIcon fontSize="inherit" />
              </IconButton>
          </Tooltip>
     
          }
          <Link underline="none" href='/'>
          <img onClick={handleRedirect}
          className={classes.media}
          style={{
            width:'40%',
            height: 'auto'
          }}
          src={logo}
        />
        </Link>
        </Box>
          }
          
      
          </Typography>
          
            <Grid className={classes.navTool} item xs={12} sm={6}>
            <Box p={0} style={{width:'100%', margin:0}} display="flex" flexDirection="row" justifyContent="flex-end"  >
          {token != null &&
          <Box item display="flex" flexDirection="row">
          <Button
            color="inherit"
            className={classes.button}
          > 
            { name? 'Hi '+name:null}
          </Button>
          <div style={{marginTop:8, width: 0, height: 20, color: green[600],borderLeft:'2px solid'}}></div>
          </Box>
          }
          
             {/* {token != null && isInstructor && !disableStudentView &&
              <Box p={2} item>
          <div style={{height: 24, borderLeft: '2px solid', borderColor: green[600]}}></div>
          </Box>
             } */}
          {token != null && isInstructor && !disableStudentView &&
           <Box item  item display="flex" flexDirection="row">
          <Button 
          color="inherit"
          onClick={handleStudentView}
          className={classes.button}
          >
            Student View
          </Button>
          <div style={{marginTop:8, width: 0, height: 20, color: green[600], borderLeft:'2px solid'}}></div>
          </Box>
           
          }
           {/* {token != null &&
           <div style={{height: 24, borderLeft: '2px solid', borderColor: green[600]}}></div>
           } */}
          {token != null &&
           <Box item>
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