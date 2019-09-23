import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red } from '@material-ui/core/colors';
import { Paper, Grid } from '@material-ui/core';
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

    }
}));
export default function CourseCard(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        role: '',
        token: sessionStorage.getItem('token')
    })


    const [redirect, setRedirect] = useState(false);
    const handleCardClick = () => {
        console.log('click working')
        setRedirect(true)

    }
    if (redirect) {
        history.push('/codewordset'+props.id)
        return <Redirect to={'/codewordset/' + props.id}></Redirect>
    }

    return (

        <Grid item xs={12} sm={3} md={3} lg={3}>
            
                <Paper className={classes.paper}>
                <CardActionArea onClick={handleCardClick}>
                    <div className={classes.appBar}>
                        <AppBar position="static" className={classes.appBar}>
                            <Typography variant="h6" className={classes.title}>
                                {props.codewordSetName}
                            </Typography>
                        </AppBar>
                    </div>

                    <Paper className={classes.paper2}>
                        <Typography variant="h8" className={classes.title}>
                            Count: {props.count}
                        </Typography><br></br>
                    </Paper>
                    {(props.isPublished) ?
                        <Paper className={classes.banner1}>

                            <Typography variant="h8" className={classes.title}>
                            FINALIZED
                    </Typography>
                        </Paper> :
                        <Paper className={classes.banner2}>
                            <Typography variant="h8" className={classes.title}>
                                NOT FINALIZED
                    </Typography>
                        </Paper>
                    }
                     </CardActionArea>
                </Paper>
           
        </Grid>

    );

}
