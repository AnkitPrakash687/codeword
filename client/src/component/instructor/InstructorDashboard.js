import { CircularProgress, DialogActions, DialogContent, Fab, FormControl, 
    FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, 
    Snackbar, Slide,TextField, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { green, grey, lightGreen } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import history from '../../history';
import API from '../../utils/API';
import AddCodewordSet from '../codewordset/AddCodewordSet';
import CodewordsetCard from '../codewordset/CodewordsetCard';
import ContainedTabs from '../mui-treasury/ContainedTabs';
import MyAppBar from '../MyAppBar';
import AddCourse from './AddCourse';
import CourseCard from './CourseCard';
const moment = require('moment')
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 3, 3, 3),
        flexGrow: 1,
        backgroundColor: grey[200],
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

    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {

    },
}));

export default function InstructorDashboard(props) {

    const LightTooltip = withStyles(theme => ({
        tooltip: {
            backgroundColor: lightGreen[200],
            color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: theme.shadows[1],
            fontSize: 13,
        },
    }))(Tooltip);

    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const inputLabel = React.useRef(null);
    const [filterCourse, setFilterCourse] = useState(10);
    const [sortCourse, setSortCourse] = useState(100);
    const [labelWidth, setLabelWidth] = React.useState(0);
    const [status, setStatus] = useState({ open: false })
    const [openCloneCodewordset, setOpenCloneCodewordset] = useState({
        open: false,
        codewordSetName: '',
        codewords: []
    });
    const [cloneCodewordsetData, setCloneCodewordsetData] = useState()
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);
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
                    style={{
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,


                    }} minHeight={500} p={3}>{children}</Box>
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
    const [report, setReport] = useState(false)
    const [newCodewordsetName, setNewCodewordsetName] = useState()
    const handleReportOpen = () => {
        setReport(true)
    }

    const handleCloneCodewordset = (event) => {
        // event.preventDefault()
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        //  let regex = /(\(\d\))+$/
        //  let reg = /[\d]+/
        //  let y = regex.exec(props.codewordSetName)
        //  let x =  y?parseInt(reg.exec(y)) + 1:1
        var data = {
            codewordSetName: newCodewordsetName,
            codewords: openCloneCodewordset.codewords
        }

        console.log('***********Add codewordset**********')
        console.log(data)

        API.post('dashboard/addcodewordset', data, { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);
            setNewCodewordsetName()
            if (response.data.code == 200) {
                //setOpenReport(true)
                setStatus({
                    open: true,
                    message: 'Duplicate set created!'
                })

            }
            else if (response.data.message.code == 11000) {
                setStatus({
                    open: true,
                    message: 'Codeword set with this name already exists'
                })

            }
            else {
                console.log('error')
                setStatus({
                    open: true,
                    message: 'Unexpected Error!'
                })
            }
        })
            .catch(error => {
                console.log(error)
                console.log('error')
                setStatus({
                    open: true,
                    message: error
                })
            });
    }

    const handleMessageClose = () => {
        setStatus({ open: false })
        setOpenCloneCodewordset({ open: false })
        setRenderCodewordSet(!renderCodewordSet)
    }
    const handleReportClose = () => {
        setReport(false)
    }
    const handleChange = name => (event, newValue) => {
        if ([name] == 'filterCourse') {
            setFilterCourse(event.target.value);
        }
        if ([name] == 'sortCourse') {
            setSortCourse(event.target.value)
        }
        if ([name] == 'value') {
            setValue(newValue)
        }
        if ([name] == 'newCodewordsetName') {
            setNewCodewordsetName(event.target.value)
        }
    }



    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = (value) => {
        setOpen(false)
        console.log('value')
        console.log(value)
        setRender(!render)
    };

    const [courseData, setCourseData] = useState([{}])
    const [codewordsetData, setCodewordsetData] = useState([{}])
    const [openCodeword, setOpenCodeword] = useState()

    const handleCodewordClickOpen = () => {
        setOpenCodeword(true)
    }

    const handleCodewordClose = () => {
        setOpenCodeword(false)
        setRenderCodewordSet(!renderCodewordSet)
        setValue(1)
    }

    const handleClone = (props) => {
        console.log('*******clone props*********')
        console.log(props)
        setOpenCloneCodewordset({
            open: true,
            codewordSetName: props.codewordSetName,
            codewords: props.codewords
        })
    }

    const handleCloneCodewordsetClose = () => {
        setOpenCloneCodewordset({ open: false })
        setRenderCodewordSet(!renderCodewordSet)
    }
    useEffect(() => {

        // console.log('***************window size*************')
        // console.log(window.innerWidth)

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
                        startDate: course.Startdate,
                        endDate: course.Enddate,
                        startSurvey: course.PreSurveyURL == '' ? 'Unpublished' : course.PreSurveyURL,
                        endSurvey: course.PostSurveyURL == '' ? 'Unpublished' : course.PostSurveyURL,
                        isAssigned: course.isAssigned,
                        'ack': ack + '/' + course.students.length
                    })
                })
                console.log('****COURSE******')
                console.log(result)
                setCourseData(result)
                setsortedData(result)
                setLoading(false)

            }
        })
            .catch(error => {
                console.log(error)

            })

    }, [render])


    useEffect(() => {

        console.log('inside effect')
        setLoading(true)
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.get('dashboard/getcodewordset', { headers: headers }).then(response => {
            console.log('👉 getcodeworset Returned data in :', response);
            let data = response.data.data
            let result = []
            data.map((item) => {
                console.log(item)
                result.push({
                    id: item.id,
                    codewordSetName: item.codewordSetName,
                    count: item.count,
                    codewords: item.codewords,
                    isPublished: item.isPublished,
                    isAdmin: item.isAdmin
                })
            })
            console.log('*******codeword sets*********')
            console.log(result)
            setCodewordsetData(result)
            setLoading(false)
        })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })

    }, [renderCodewordSet])

    useEffect(() => {
        if (history.location.state) {
            console.log('************history***********')
            console.log(history.location.state.value)
            setValue(history.location.state.value)
        } else {
            setValue(0)
        }

    }, [])


    const [filteredData, setFilteredData] = useState([{}])
    const [sortedData, setsortedData] = useState([{}])
    useEffect(() => {
        console.log('****values******')
        console.log(sortCourse + ' ' + filterCourse)
        var filterData = []
        setsortedData([])
        let currentDate = moment()


        if (filterCourse == 10) {
            filterData = courseData
        } else if (filterCourse == 0) {
            filterData =
                courseData.filter((course) => {
                    if (course.isAssigned) {
                        return course
                    }
                })


        } else if (filterCourse == 1) {
            filterData =
                courseData.filter((course) => {
                    if (!course.isAssigned) {
                        return course
                    }
                })

        } else if (filterCourse == 2) {

            filterData =
                courseData.filter((course) => {
                    if (currentDate.isSameOrBefore(course.endDate) && currentDate.isSameOrAfter(course.startDate)) {
                        return course
                    }
                })

        } else if (filterCourse == 3) {

            filterData =
                courseData.filter((course) => {
                    if (currentDate.isAfter(course.endDate) || currentDate.isBefore(course.startDate)) {
                        return course
                    }
                })

        }
        if (sortCourse == 100) {
            setsortedData(filterData)
        }
        else if (sortCourse == 0) {

            var s = filterData.sort(sort_by('courseName', true, (a) => a.toUpperCase(), false))
            setsortedData(s)

        } else if (sortCourse == 1) {

            var s = filterData.sort(sort_by('courseName', false, (a) => a.toUpperCase(), false))
            setsortedData(s)
        } else if (sortCourse == 2) {

            var s = filterData.sort(sort_by('startDate', true, null, true))
            setsortedData(s)
        } else if (sortCourse == 3) {
            var s = filterData.sort(sort_by('startDate', false, null, true))
            setsortedData(s)
        }

    }, [filterCourse, sortCourse])




    const listCourses = sortedData.map((course) => {
        return <CourseCard id={course.id}
            courseName={course.courseName}
            ack={course.ack}
            startDate={course.startDate ? course.startDate.toString().substring(0, 10) : null}
            endDate={course.endDate ? course.startDate.toString().substring(0, 10) : null}
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
            isPublished={item.isPublished}
            codewords={item.codewords}
            onClone={handleClone}
        ></CodewordsetCard>
    })

    const sort_by = (field, reverse, primer, isDate) => {

        const key = primer ?
            function (x) {
                return primer(x[field])
            } :
            function (x) {
                return x[field]
            };

        const dateKey = function (x) {
            var date = new Date(x[field].toString())
            return date.getTime()
        }


        reverse = !reverse ? 1 : -1;
        const r = isDate ?
            function (a, b) {
                // return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
                return a = dateKey(a), b = dateKey(b), reverse * ((a > b) - (b > a));
            }
            :
            function (a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }

        return r
    }

    const handleDialogClose = name => (event) => {
        console.log('Dialog')
        console.log(name)
        if (name == 'clone') {
            setOpenCloneCodewordset({ open: false })
            setNewCodewordsetName()
        }
    }

    return (
        <div>

            <MyAppBar />
            <Box p={2} display="flex" style={{ width: '100%' }} flexDirection="row" justifyContent="flex-start">
                <Typography component="div">
                    <Box fontSize={24} color={grey[800]} fontWeight="fontWeightBold" m={1}>
                        Instructor Dashboard
                    </Box>
                </Typography>
            </Box>
            <div className={classes.root}>


                <div>

                    <ContainedTabs
                        style={{ alignSelf: 'flex-center', }}
                        tabs={[
                            { label: 'Course' },
                            { label: 'Codeword' }
                        ]}
                        value={value}
                        onChange={handleChange('value')}
                    >

                    </ContainedTabs>


                    <TabPanel value={value} index={0}>

                        {/* <Button variant="contained" color="primary" className={classes.button} onClick={handleClickOpen}>
                    Add Course
                </Button> */}
                        <Grid container>
                            <Grid item xs={6} sm={6}>
                                <Box style={{ width: '100%' }} display="flex" flexDirection="row">
                                    <LightTooltip title="Add Course" placement="right">
                                        <Fab aria-label="add" className={classes.button} onClick={handleClickOpen}>
                                            <AddIcon />
                                        </Fab>
                                    </LightTooltip>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Box style={{ width: '100%' }} display="flex" flexDirection="row" justifyContent="flex-end">
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel ref={inputLabel} htmlFor="outlined-filterCourse-simple">
                                            Filter
                                    </InputLabel>
                                        <Select
                                            value={filterCourse}
                                            onChange={handleChange('filterCourse')}
                                            labelWidth={labelWidth}
                                            inputProps={{
                                                name: 'filterCourse',
                                                id: 'filterCourse-label-placeholder',
                                            }}
                                            displayEmpty
                                            name="filterCourse"
                                            className={classes.selectEmpty}
                                        >
                                            <MenuItem value={10}>
                                                <em>All</em>
                                            </MenuItem>
                                            <MenuItem value={0}>Assigned</MenuItem>
                                            <MenuItem value={1}>Not Assigned</MenuItem>
                                            <MenuItem value={2}>Active</MenuItem>
                                            <MenuItem value={3}>Inactive</MenuItem>
                                        </Select>
                                        <FormHelperText></FormHelperText>
                                    </FormControl>

                                    {/* <FormControl  variant="outlined" className={classes.formControl}>
                                    <InputLabel ref={inputLabel} htmlFor="outlined-filterCourse-simple">
                                            Sort
                                    </InputLabel>
                                        <Select
                                            value={sortCourse}
                                            onChange={handleChange('sortCourse')}
                                            labelWidth={labelWidth}
                                            inputProps={{
                                                name: 'sortCourse',
                                                id: 'sortCourse-label-placeholder',
                                            }}
                                            displayEmpty
                                            name="sortCourse"
                                            className={classes.selectEmpty}
                                        >
                                            <MenuItem value={100}>
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={0}>
                                                Course Name(Ascending)
                                            </MenuItem>
                                            <MenuItem value={1}>Course Name(Descending)</MenuItem>
                                            <MenuItem value={2}>Start Date(Ascending)</MenuItem>
                                            <MenuItem value={3}>Start Date(Descending)</MenuItem>
                                            
                                        </Select>
                                        <FormHelperText></FormHelperText>
                                    </FormControl> */}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* <SimpleDialog closeAfterTransition={true} open={open} onClose={handleClose} render={render} /> */}

                        <Dialog disableBackdropClick={true} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                            <div>

                                <AddCourse onClose={handleClose}></AddCourse>
                            </div>
                        </Dialog>
                        {loading ? <Grid container
                            spacing={0}
                            alignItems="center"
                            justify="center"
                            style={{ minHeight: '100vh' }}>
                            <CircularProgress className={classes.progress} />
                        </Grid>
                            :
                            <Grid container spacing={3}>

                                {
                                    !loading && listCourses.length > 0 &&
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
                            <Fab aria-label="add" className={classes.button} onClick={handleCodewordClickOpen}>
                                <AddIcon />
                            </Fab>
                        </LightTooltip>
                        <Dialog disableBackdropClick={true} onClose={handleCodewordClose} aria-labelledby="simple-dialog-title" open={openCodeword}>
                            <div>

                                <AddCodewordSet onClose={handleCodewordClose}></AddCodewordSet>
                            </div>
                        </Dialog>

                        {loading ? <Grid container
                            spacing={0}
                            alignItems="center"
                            justify="center"
                            style={{ minHeight: '100vh' }}>
                            <CircularProgress className={classes.progress} />
                        </Grid>
                            :
                            <Grid container spacing={3}>

                                {
                                    !loading && listCodewordSet.length > 0 &&
                                    listCodewordSet
                                }

                            </Grid>
                        }
                    </TabPanel>

                    <Dialog
                        open={openCloneCodewordset.open}
                        onClose={handleDialogClose('clone')}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Clone Codeword Set: " + openCloneCodewordset.codewordSetName}</DialogTitle>
                        <DialogContent>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                margin="dense"
                                name="newCodewordsetName"
                                label="New Codewordset Name"
                                type="text"
                                id="newCodewordsetName"
                                autoComplete="current-password"
                                value={newCodewordsetName}
                                onChange={handleChange('newCodewordsetName')}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose('clone')} color="secondary">
                                Cancel
          </Button>
                            <Button onClick={handleCloneCodewordset} color="primary" autoFocus>
                                Clone
          </Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        TransitionComponent={Slide}
                        TransitionProps={
                            { direction: "right" }
                        }
                        open={status.open}
                        autoHideDuration={2000}
                        variant="success"
                        onClose={handleMessageClose}
                        message={status.message}
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
        </div>

    );

}
