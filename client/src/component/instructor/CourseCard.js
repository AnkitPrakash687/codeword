import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red } from '@material-ui/core/colors';
import { Paper, Grid, Tooltip, Link, Box } from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import API from '../../utils/API'
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Redirect } from "react-router-dom";
import history from '../../history'



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
        margin: 10,
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
          backgroundColor: green[500],
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
          fontSize: 13,
        },
      }))(Tooltip);

    return (

        <Grid item xs={12} sm={3} md={3} lg={3}>
              <CardActionArea onClick={handleCardClick}>
                <Paper className={classes.paper}>
              
                    <Grid  container className={classes.appBar}>
                        <AppBar position="static" className={classes.appBar}>
                            { window.innerWidth > 400?
                            <LightTooltip title={props.courseName}  enterDelay={500} placement="top-start">
                            <Typography noWrap variant="body1" className={classes.title}>
                                {props.courseName}
                            </Typography>
                            </LightTooltip>
                            :
                            <Typography variant="body1" className={classes.title}>
                            {props.courseName}
                            </Typography>
                    }
                        </AppBar>
                    </Grid>
                   
                    <div className={classes.clickable} onClick={handleCardClick}>
                    <Grid container>
                        <Grid item xs ={2} sm={2}></Grid>
                        <Grid item>
                    <Box display="flex">
                       
                    <Paper className={classes.paper2}>
                        
                        <Typography variant="h8" >
                            Aknowledged: {props.ack}
                        </Typography>
                        <Box display="flex" >
                        { props.startSurvey != 'Unpublished'?
                        <Link onClick={event => event.stopPropagation()} target="_blank" href={props.startSurvey} variant="body2" className={classes.startSurvey}>
                         Start Survey
                      </Link>
                        :<Typography className={classes.startSurvey} variant="body2">Start Survey</Typography>
                        }
                        { props.endSurvey != 'Unpublished'?
                        <Link onClick={event => event.stopPropagation()} target="_blank" href={props.endSurvey} variant="body2" className={classes.link}>
                         End Survey
                      </Link>
                       
                        :<Typography className={classes.startSurvey} variant="body2">End Survey</Typography>
                        }
                      </Box>
                    </Paper>
                  
                    </Box>
                    </Grid>
                    <Grid item xs={2} sm={2}></Grid>
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

                            <Typography variant="h8" className={classes.title}>
                                CODEWORD ASSIGNED
                    </Typography>
                        </Paper> :
                        <Paper className={classes.banner2}>
                            <Typography variant="h8" className={classes.title}>
                                CODEWORD NOT ASSIGNED
                    </Typography>
                        </Paper>
                    }
                   
                </Paper>
                </CardActionArea>
        </Grid>

    );

}
