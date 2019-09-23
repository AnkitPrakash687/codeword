import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, grey } from '@material-ui/core/colors';
import { Paper, Grid, Button, Zoom, IconButton, Tooltip, Box, Link} from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import API from '../../utils/API'
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Redirect } from "react-router-dom";
import FileCopyIcon from '@material-ui/icons/FileCopy';

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
        minWidth: 200
    },
    paper2: {
        padding: 10,
        margin: 10,
        background: grey[200]
    },
    survey:{
        marginLeft: 10,
        marginRight: 10,
        padding:10
    },
    title: {
        padding: theme.spacing(1)
    },
    revealButton: {
        margin: theme.spacing(1)
    },
    codeword: {
        margin: theme.spacing(1)
    }

}));
export default function CourseCard(props) {
    const classes = useStyles();
    const [reveal, setReveal] = useState(props.isRevealed)
    const [codeword, setCodeword] = useState(props.codeword)
    const [tooltip, setTooltip] = useState("Copy")
    const LightTooltip = withStyles(theme => ({
        tooltip: {
          backgroundColor: theme.palette.common.white,
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
          fontSize: 11,
        },
      }))(Tooltip);

    const handleClickReveal = () => {

        const headers = {
            'token': sessionStorage.getItem('token')
        };

        console.log(props)

        API.post('dashboard/reveal', { courseId: props.id }, { headers: headers }).then(response => {
            if (response.data.code == 200) {
                setReveal(true)
                setCodeword(response.data.codeword)
            }
        })

    }

    const handleCopy = () => {
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
              navigator.clipboard.writeText(codeword)
              setTooltip("Copied!")
              setInterval(function(){
                setTooltip("Copy")
              }, 2000)
            }
          });
    }
    return (

        <Grid item xs={12} sm={3} md={3} lg={3}>

            <Paper className={classes.paper}>

                <div className={classes.appBar}>
                    <AppBar position="static" className={classes.appBar}>
                        {
                        <LightTooltip title={props.courseName} placement="top-start">
                        <Typography noWrap variant="h6" className={classes.title}>
                            {props.courseName} 
                        </Typography>
                        </LightTooltip>
                        }
                    </AppBar>
                </div>

                <Paper className={classes.paper2}>
                    {!reveal ?
                        <Grid container justify="center">
                            <Zoom in={!reveal}>
                                <Button variant="contained" color="primary" className={classes.revealButton} onClick={handleClickReveal}>
                                    Reveal
                </Button>
                            </Zoom>
                        </Grid> :
                        <Grid container justify="center">
                            <Zoom in={reveal}>

                                <Typography variant="h6" className={classes.codeword}>
                                    {codeword
                                    }
                                </Typography>

                            </Zoom>
                            <Tooltip title={tooltip}>
                                <IconButton className={classes.button} onClick={handleCopy} aria-label="Copy">
                                    <FileCopyIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    }
                </Paper>
               
                <div className={classes.survey}>
              <Box display="flex" justifyContent="space-between">
                        { props.startSurvey != 'Unpublished'?
                       <Box display="flex" >
                        <Link onClick={event => event.stopPropagation()} target="_blank" href={props.startSurvey} variant="body2" className={classes.startSurvey}>
                         Start Survey
                      </Link>
                      </Box>
                        :<Typography variant="body">Start Survey</Typography>
                        }
                        { props.endSurvey != 'Unpublished'?
                     <Box display="flex" >
                        <Link onClick={event => event.stopPropagation()} target="_blank" href={props.endSurvey} variant="body2" className={classes.link}>
                         End Survey
                      </Link>
                   </Box>
                        :<Typography variant="body">End Survey</Typography>
                        }
                     
                     </Box>
                    </div>
                
            </Paper>
                    
        </Grid>

    );

}
