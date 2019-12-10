import { Box, Grid, Link, Paper, Tooltip } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CardActionArea from '@material-ui/core/CardActionArea';
import { green, lightGreen, red } from '@material-ui/core/colors';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import history from '../../history';


const useStyles = makeStyles(theme => ({
    root: {
        margin: 30,
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        borderRadius: 5,
        background: green[600]
    },
    paper: {
        borderRadius: 5,
        paddingBottom: 20,
        maxWidth: 300,
        minWidth:200
    },
    paper2: {
        padding: 10,
        margin: theme.spacing(2,0,2,0),
        minWidth: 220,
        minHeight: 55,
        background: lightGreen[200]
    },
    title: {
        padding: 10
    },
    banner1: {
        background: lightGreen[200],
        padding: 5,
        marginTop: 5
    },
    banner2: {
        background: red[200],
        padding: 5,
        marginTop: 5

    },
    startSurvey:{
       marginRight: theme.spacing(1)
    },
    clickable:{
        "&:hover":{
            cursor: "pointer"
        }
    }
}));
export default function CourseCard(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        role: '',
        token: sessionStorage.getItem('token')
    })

    useEffect(() => {
        // console.log('getdata')
        // const headers = {
        //     'Content-Type': 'application/json',
        //     'token':  this.state.token
        //   };

        // console.log(headers)
        //  try {
        //     const response = await API.get('dashboard/details', {headers});
        //     console.log('👉 Returned data in :', response);
        //     console.log(response.data)
        //     if(response.status == 200){
        //     this.setState( {
        //       id: response.data.email_id,   
        //       role: response.data.role,
        //       name: response.data.first_name + ' ' + response.data.last_name
        //     })
        //     console.log('dashbaord : '+ this.state.role)

        // }else {

        // }
        //   } catch (e) {
        //     console.log(`😱 Axios request failed: ${e}`);
        //   }
    })
    const [redirect, setRedirect] = useState(false);
    const handleCardClick = () => {
        console.log('click working')
        setRedirect(true)

    }
    if (redirect) {
        history.push('/course'+props.id)
        return <Redirect to={'/course/' + props.id}></Redirect>
    }

    const LightTooltip = withStyles(theme => ({
        tooltip: {
          backgroundColor: green[100],
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
          fontSize: 13,
        },
      }))(Tooltip);

      const handleClone = ()=>{

      }

    return (

        <Grid item xs={12} sm={3} md={3} lg={3}>
              <CardActionArea onClick={handleCardClick}>
                <Paper className={classes.paper}>
              
                    <Grid  container className={classes.appBar}>
                        <AppBar position="static" className={classes.appBar}>
                            { window.innerWidth > 500?
                            <LightTooltip title={props.courseName}  enterDelay={500} placement="top-start">
                            <Typography noWrap variant="h6" className={classes.title}>
                                {props.courseName}
                            </Typography>
                            </LightTooltip>
                            :
                            <Typography variant="h6" className={classes.title}>
                            {props.courseName}
                            </Typography>
                    }
                        </AppBar>
                    </Grid>
                   
                    <div className={classes.clickable} onClick={handleCardClick}>
                    <Grid container>
                        <Grid item xs ={1} sm={1}></Grid>
                       
                        <Grid item xs ={10} sm={10}>
                    <Box display="flex">
                       
                    <Paper className={classes.paper2}>
                    <Box display="flex" justifyContent="center">
                        <Typography gutterBottom component="div" variant="body1" >
                            <Box fontSize={17} fontWeight="bold">
                            Aknowledged: {props.ack}
                            </Box>
                        </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                        <Box display="flex">
                        { props.startSurvey != 'Unpublished'?
                        <Link  target="_blank"  variant="caption" className={classes.startSurvey}>
                         Start Survey Link
                        </Link>
                        :<Typography className={classes.startSurvey} variant="caption">Start Survey: N/A</Typography>
                        }
                        </Box>
                        <Box display="flex">
                        { props.endSurvey != 'Unpublished'?
                        <Link  target="_blank"  variant="caption" className={classes.link}>
                         End Survey Link
                        </Link>                       
                        :<Typography className={classes.startSurvey} variant="caption">End Survey: N/A</Typography>
                        }
                        </Box>
                      </Box>
                    </Paper>
                  
                    </Box>
                    </Grid>
                    <Grid item xs={1} sm={1}></Grid>
                    </Grid>
                    </div>
                  
                    <Grid className={classes.dates} container spacing={0}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Typography variant="caption" className={classes.title}>
                                Start date: {props.startDate}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Typography variant="caption" className={classes.title}>
                                End Date: {props.endDate}
                            </Typography>
                        </Grid>
                    </Grid>
                    
                    {(props.isAssigned) ?
                        <Paper className={classes.banner1}>
                                <Box display="flex" justifyContent="center">
                    <Typography component="div">
                                <Box fontWeight="bold" fontSize={15}>
                                ASSIGNED
                                </Box>
                    </Typography>
                    </Box>
                        </Paper> :
                        <Paper className={classes.banner2}>
                            <Box display="flex" justifyContent="center">
                           <Typography component="div">
                                <Box fontWeight="bold" fontSize={15}>
                                NOT ASSIGNED
                                </Box>
                              
                    </Typography>
                
                    </Box>
                   
                        </Paper>
                    }
                     {/* <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={handleClone}
                        >
                            <ControlPointDuplicateIcon />
                        </IconButton> */}
                </Paper>
              
                </CardActionArea>
               
        </Grid>

    );

}
