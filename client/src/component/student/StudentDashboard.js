import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, grey, red } from '@material-ui/core/colors';
import { Paper, Grid, CircularProgress, Container, CssBaseline, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button'
import API from '../../utils/API'
import Card from './CourseCard'
import MyAppBar from '../MyAppBar';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 30,
        flexGrow: 1,
        backgroundColor: theme.palette.white,
    },
    menuBar:{
        minHeight: 60,
        background: green[500]
    },
    appBar: {
        background: green[600]
    },
    paper: {
        minHeight: 500,
        padding: 20,
        background: lightGreen[200]
    },
    paper2: {
        padding: 20,
        margin: 20,
        background: lightGreen[200]
    },
    title: {
        padding: 10
    },
    banner1: {
        background: lightGreen[200],
        paddingLeft: 20
    },
    banner2: {
        background: red[200],
        padding: 10

    },
    button: {
        margin: theme.spacing(2),
        textTransform: "none",
        color: grey[300]

    }
}));

export default function StudentDashboard() {

   

    const [value, setValue] = useState(0);
    const [snack, setSnack] = useState({
        status: false,
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [instructorRequest,setInstructorRequest] = useState();
    const [isInstructor, setIsInstructor] = useState(false)
    const classes = useStyles();
   
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const handleMessageClose = value => {
        setSnack({status:false})
    };

    const [courseData, setCourseData] = useState([{}])
    const [render, setRender] = useState(false)
    useEffect(() => {
        setLoading(true)
        console.log('inside effect')
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        API.get('dashboard/details', { headers: headers }).then(response => {
            console.log("me***********")
            
                return response.data
            
            // else{
            //     return false
            // }
        })
        .then(user => {
            console.log('*******user request')
            console.log(user)
            if(user.role == 'instructor'){
                setIsInstructor(true)
            }
            setInstructorRequest(user.instructorRequest)
            API.get('dashboard/getStudentCourses', { headers: headers }).then(response => {
                console.log('👉 Returned data in :', response);
    
              
                if (response.status == 200) {
                    console.log(response.data)
                    var data = response.data.data
                    var result = []
                    data.map((course) => {
                        var student = course.students.filter((student)=>{
                            if(user.email_id == student.email){
                                return student
                            }
                        })
                        result.push({
                            id: course._id,
                            courseName: course.courseNameKey,
                            startDate: (course.Startdate.toString()).substring(0, 10),
                            endDate: (course.Enddate.toString()).substring(0, 10),
                            startSurvey: course.PreSurveyURL == '' ? 'Unpublished' : course.PreSurveyURL,
                            endSurvey: course.PostSurveyURL == '' ? 'Unpublished' : course.PostSurveyURL,
                            isRevealed: student[0].isRevealed,
                            codeword: student[0].codeword
                        })
                    })
                    console.log("****result******")
                    console.log(result)
                    setCourseData(result)
                    setLoading(false)
                }
            })
                .catch(error => {
                    console.log(error)
                   
                })
        })
       
    }, [])

  const handleInstructorRequest = () =>{
    const headers = {
        'token': sessionStorage.getItem('token')
    };

    API.post('dashboard/instructorRequest', {},{ headers: headers }).then(response => {
        console.log(response.data)
        if(response.data.code == '200'){
            setSnack({
                status: true,
                message: 'Request Sent!'
            })
            setInstructorRequest(true)
            
        }
    })
  }
    const listCourses = courseData.map((course) => {
        return <Card id={course.id}
            courseName={course.courseName}
            ack={course.ack}
            startDate={course.startDate}
            endDate={course.endDate}
            startSurvey={course.startSurvey}
            endSurvey={course.endSurvey}
            isAssigned={course.isAssigned}
            isRevealed = {course.isRevealed}
            codeword = {course.codeword}
        ></Card>
    })

    return (
        <div>
            <MyAppBar/>
         <div className={classes.root}>
             {loading? <Grid container
            spacing={0}
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}>
            <CircularProgress className={classes.progress} />
        </Grid>
        :            
            <Container component="main" maxWidth='lg'>
                    <CssBaseline />
                    <Paper className={classes.menuBar}>
                        <Grid container >
                           <Grid item sm={12}> 
                        <Box display="flex" justifyContent="flex-end">

                            { !instructorRequest && !isInstructor &&
                        <Button
                            size="small"
                            className={classes.button}
                            disabled = {instructorRequest}
                            onClick={handleInstructorRequest}
                        >
                            <Typography fontFamily="-apple-system" component="div">
                                  <Box  m={1}>
                                    Request Instructor Privilege
                                </Box>
                                </Typography>
                        </Button>
                            }
                        </Box>
                        </Grid>
                        </Grid>
                    </Paper>
                <Paper className  className={classes.paper}>
                    
                    <Grid container spacing={3}>

                        {
                            listCourses
                        }

                    </Grid>
                </Paper>  
          
            </Container>
             }

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snack.status}
                autoHideDuration={2000}
                variant="success"
                onClose={handleMessageClose}
                message={snack.message}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={handleMessageClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            ></Snackbar>
        </div>
        </div>
                
    );

}
