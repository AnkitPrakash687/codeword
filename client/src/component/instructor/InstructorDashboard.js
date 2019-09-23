import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, grey } from '@material-ui/core/colors';
import { Paper, Grid, Fab, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CourseCard from './CourseCard'
import CodewordsetCard from '../codewordset/CodewordsetCard'
import AddCodewordSet from '../codewordset/AddCodewordSet'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button'
import AddCourse from './AddCourse'
import {CircularProgress} from '@material-ui/core'
import API from '../../utils/API'
import ContainedTabs from '../mui-treasury/ContainedTabs'
import MyAppBar from '../MyAppBar'
import { light } from '@material-ui/core/styles/createPalette';
const useStyles = makeStyles(theme => ({
    root: {
        margin: 30,
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        background: green[600]
    },
    paper: {
        paddingBottom: 20
    },
    paper2: {
        padding: 20,
        margin: 20,
        background: lightGreen[200]
    },
    title: {
        padding: 10
    },
 
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
      },
    button: {
        marginBottom: theme.spacing(2),
        background: green[500],
        "&:hover": {
            backgroundColor: "green"
        }

    }
}));

export default function InstructorDashboard() {

    const LightTooltip = withStyles(theme => ({
        tooltip: {
          backgroundColor: lightGreen[200],
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
          fontSize: 13,
        },
      }))(Tooltip);

    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false)

    const classes = useStyles();
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                <Box bgcolor={lightGreen[100]}
                style={ {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,

                }} minHeight={400} p={3}>{children}</Box>
            </Typography>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

 
    const [render, setRender] = useState(false);
    const [renderCodewordSet, setRenderCodewordSet] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    function SimpleDialog(props) {

        const { onClose, open, render } = props;

        const handleClose = (error) => {
            console.log('render   ' + render)
            setRender(!render)
            onClose();
        }

        function handleListItemClick(value) {
            onClose(value);
        }
        
        return (

            <Dialog fullWidth={true} disableBackdropClick={true} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>    
                 <div>
                 <DialogTitle id="simple-dialog-title">Add Course</DialogTitle>
                <AddCourse onClose={handleClose}></AddCourse>
                </div>         
            </Dialog>
        );
    }

    SimpleDialog.propTypes = {
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        render: PropTypes.bool.isRequired,

    };

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = value => {
        setOpen(false)
    };

    const [courseData, setCourseData] = useState([{}])
    const [codewordsetData, setCodewordsetData] = useState([{}])
    const [openCodeword, setOpenCodeword] = useState()
  
    const handleCodewordClickOpen = () =>{
        setOpenCodeword(true)
    }

    const handleCodewordClose = () => {
        setOpenCodeword(false)
        setRenderCodewordSet(!renderCodewordSet)
        setValue(1)
    }
    useEffect(() => {

        console.log('***************window size*************')
        console.log(window.innerWidth)

        setLoading(true)
        console.log('inside effect')
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.get('dashboard/getCourseList', { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);

            if (response.status == 200) {
                console.log(response.data)
                var data = response.data.data
                var result = []
                data.map((course) => {
                    var ack = 0
                    ack = course.students.reduce((acc, item) => {
                        if (item.isRevealed) {
                            return acc + 1
                        } else {
                            return acc + 0
                        }
                    }, 0)
                    result.push({
                        id: course._id,
                        courseName: course.courseNameKey,
                        startDate: (course.Startdate.toString()).substring(0, 10),
                        endDate: (course.Enddate.toString()).substring(0, 10),
                        startSurvey: course.PreSurveyURL == '' ? 'Unpublished' : course.PreSurveyURL,
                        endSurvey: course.PostSurveyURL == '' ? 'Unpublished' : course.PostSurveyURL,
                        isAssigned: course.isAssigned,
                        'ack': ack + '/' + course.students.length
                    })
                })

                console.log(result)
                setCourseData(result)
                setLoading(false)
            }
        })
            .catch(error => {
                console.log(error)
          
            })

    }, [render])


    useEffect(() => {

        console.log('inside effect')
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.get('dashboard/getcodewordset', { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);
            let data = response.data.data
            let result = []
            data.map((item)=>{
                console.log(item)
                result.push({
                    id: item.id,
                    codewordSetName: item.codewordSetName,
                    count: item.count,
                    isPublished: item.isPublished
                })
            })
            setCodewordsetData(result)
        })
            .catch(error => {
                console.log(error)
          
            })

    }, [renderCodewordSet])

    const listCourses = courseData.map((course) => {
        return <CourseCard id={course.id}
            courseName={course.courseName}
            ack={course.ack}
            startDate={course.startDate}
            endDate={course.endDate}
            startSurvey={course.startSurvey}
            endSurvey={course.endSurvey}
            isAssigned={course.isAssigned}
        ></CourseCard>
    })

    const listCodewordSet = codewordsetData.map((item) => {
        // console.log('*******codeworset*******')
        // console.log(item)
        return <CodewordsetCard id={item.id}
            codewordSetName={item.codewordSetName}
            count={item.count}
            isPublished = {item.isPublished}
        ></CodewordsetCard>
    })
    return (
       <div>

       <MyAppBar/>
        <div className={classes.root}>
            
        <div>
        
        <ContainedTabs
        style={{ alignSelf: 'flex-center',  }}
        tabs={[
          { label: 'Course' },
          { label: 'Codeword' }
        ]}
        value={value}
        onChange={handleChange}
      >

      </ContainedTabs>

                    
            <TabPanel value={value} index={0}>

                {/* <Button variant="contained" color="primary" className={classes.button} onClick={handleClickOpen}>
                    Add Course
                </Button> */}
                <LightTooltip title="Add Course" placement="right">
            <Fab  aria-label="add" className={classes.button} onClick={handleClickOpen}>
                <AddIcon />
            </Fab>
            </LightTooltip>
                <SimpleDialog open={open} onClose={handleClose} render={render} />

                {loading?     <Grid container
            spacing={0}
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}>
            <CircularProgress className={classes.progress} />
        </Grid>
        :
                <Grid container spacing={3}>

                    {
                        listCourses
                    }

                </Grid>
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
            {/* <Button variant="contained" color="primary" className={classes.button} onClick={handleCodewordClickOpen}>
                    Add codeword Set
            </Button> */}
            <LightTooltip title="Add Codeword set" placement="right">
            <Fab  aria-label="add" className={classes.button} onClick={handleCodewordClickOpen}>
                <AddIcon />
            </Fab>
            </LightTooltip>
            <Dialog  fullWidth={true} disableBackdropClick={true} onClose={handleCodewordClose} aria-labelledby="simple-dialog-title" open={openCodeword}>    
                 <div>
                 <DialogTitle id="simple-dialog-title">Add Codeword Set</DialogTitle>
                <AddCodewordSet onClose={handleCodewordClose}></AddCodewordSet>
                </div>         
            </Dialog>
            {loading?     <Grid container
            spacing={0}
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}>
            <CircularProgress className={classes.progress} />
        </Grid>
        :
               <Grid container spacing={3}>

                    {
                        listCodewordSet
                    }

                </Grid>
            }
        </TabPanel>
        </div>
                
        </div>
        </div>

    );

}
