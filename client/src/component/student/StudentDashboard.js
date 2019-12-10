import { CircularProgress, Slide, CssBaseline,
     Grid, IconButton, Paper, Snackbar, Tooltip, Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { green, grey, lightGreen, red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import history from '../../history';
import API from '../../utils/API';
import MyAppBar from '../MyAppBar';
import Card from './CourseCard';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(0, 2, 2, 2),
        flexGrow: 1,
        backgroundColor: theme.palette.white,
    },
    menuBar: {
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

    const [value, setValue] = useState(0)
    const [redirect, setRedirect] = useState(0)
    const view = sessionStorage.getItem('view')
    const [snack, setSnack] = useState({
        status: false,
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [instructorRequest, setInstructorRequest] = useState()
    const [isInstructor, setIsInstructor] = useState(false)
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const handleMessageClose = value => {
        setSnack({ status: false })
    };

    const [courseData, setCourseData] = useState([{}])
    const [render, setRender] = useState(false)
    useEffect(() => {
        window.scrollTo(0, 0)
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
                if (user.role == 'instructor') {
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
                            var student = course.students.filter((student) => {
                                if (user.email_id == student.email) {
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

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }


    const handleInstructorRequest = () => {
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        API.post('dashboard/instructorRequest', {}, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == '200') {
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
            isRevealed={course.isRevealed}
            codeword={course.codeword}
        ></Card>
    })

    const handleBackButton = () => {
        setRedirect(true)
    }

    if (redirect) {
        history.push('/', { value: 0 })
        return <Redirect to="/"></Redirect>
    }

    return (
        <div>
            <MyAppBar disableStudentView={true} backButton={true} from="course" view={view} />
            <Box p={2} display="flex" style={{ width: '100%' }} flexDirection="row" justifyContent="flex-start">
                <Typography component="div">
                    <Box fontSize={24} color={grey[800]} fontWeight="fontWeightBold" m={1}>
                        Student Dashboard
                    </Box>
                </Typography>
            </Box>
            <div className={classes.root}>
                {loading ? <Grid container
                    spacing={0}
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}>
                    <CircularProgress className={classes.progress} />
                </Grid>
                    :
                    <div className={classes.root} minWidth='xs'>
                        <CssBaseline />
                        <Paper className={classes.menuBar}>
                            { /*view == 'instructor' &&
                        <Box p={1}>
                            <Tooltip title="Back to dasboard" placement="right">
                                <IconButton
                                    className={classes.backButton}
                                    onClick={handleBackButton}

                                >
                                    <ArrowBackIosIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                            </Box>
             */ }
                            <Grid container >
                                <Grid item sm={12}>
                                    <Box display="flex" justifyContent="flex-end">

                                        {!instructorRequest && !isInstructor &&
                                            <Button
                                                size="small"
                                                className={classes.button}
                                                disabled={instructorRequest}
                                                onClick={handleInstructorRequest}
                                            >
                                                <Typography fontFamily="-apple-system" component="div">
                                                    <Box m={1}>
                                                        Request Instructor Privilege
                                </Box>
                                                </Typography>
                                            </Button>
                                        }
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper className className={classes.paper}>

                            <Grid container spacing={3}>

                                { listCourses.length > 0?
                                    listCourses: 
                                    <Box 
                                    display="flex"
                                    justifyContent="center"
                                   
                                    style={{ width:'100%', marginTop: '100px' }}>
                                    
                                    <Typography fontFamily="-apple-system" component="div">
                                     <Box fontSize={24} color={grey[800]} fontWeight="fontWeightBold" m={1}>
                                        You are not registered in any of the courses
                                    </Box>
                                    </Typography>
                                   
                                    </Box>
                                }

                            </Grid>
                        </Paper>

                    </div>
                }

                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    TransitionComponent={Slide}
                    TransitionProps={
                        { direction: "right" }
                    }
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
