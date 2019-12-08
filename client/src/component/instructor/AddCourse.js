import DateFnsUtils from '@date-io/date-fns';
import {
    Box, Button, Chip, CircularProgress, Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider, FormControl, Grid, IconButton, InputLabel, MenuItem,
    Modal, OutlinedInput, Paper, Select, Slide, Snackbar, Tooltip,
    SnackbarContent} from '@material-ui/core';
import { green, grey, lightGreen, red } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import InfoIcon from '@material-ui/icons/Info';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import API from '../../utils/API';

const Papa = require('papaparse')
const Validator = require('validator')
var moment = require('moment');
var _ = require("underscore");
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
    form: {


    },
    appBar: {
        background: green[600]
    },
    paper2: {
        padding: 20,
        margin: 20,

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
    formControl: {
        marginTop: theme.spacing(2),
    },
    input: {
        display: 'none',
    },
    textField: {
        marginTop: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(1)
    },
    chip: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    submit: {
        background: green[600],


        "&:hover": {
            backgroundColor: "green"
        }
    },
    cancel: {
        background: red[600],

        "&:hover": {
            backgroundColor: "red"
        }
    },
    paper: {
        padding: theme.spacing(2),
        background: grey[100],
        borderRadius: 5
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: green[700],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    report: {

        position: 'absolute',
        minWidth: 300,
        maxWidth: 800,
        maxHeight: 500,
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],


    },
    alertreport: {

        position: 'absolute',
        maxWidth: 400,
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],


    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    reportButton: {
        margin: theme.spacing(2)
    }
}));

export default function AddCourse(props) {

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState({
        role: '',
        token: sessionStorage.getItem('token'),
        courseName: '',
        startSurvey: '',
        endSurvey: '',
        startDate: new Date(),
        endDate: moment().add(4, 'months'),
        selectedDate: '',
        values: '',
        studentFilename: '',
        status: false,
        error: false,
        message: '',
        reRender: false,
        alertOpen: true,
        snackcolor: {
            backgroundColor: grey[800]
        }
    })

    const [codewordStudentCountError, setCodewordStudentCountError] = useState({
        open: false,
        message: ''
    })
    const [codewordSetCount, setCodewordSetCount] = useState()
    const [studentCount, setStudentCount] = useState()
    const [error, setError] = useState({
        startSurvey: {
            status: false,
            helperText: ''
        },
        endSurvey: {
            status: false,
            helperText: ''
        }

    })
    function getModalStyle() {

        return {

        };
    }

    const [modalStyle] = React.useState(getModalStyle);
    const inputLabel = React.useRef(null);
    const fileLabel = React.useRef(null)
    const [labelWidth, setLabelWidth] = React.useState(0);
    const [students, setStudents] = useState({
        validRecords: []
    })
    const [file, setFile] = useState({
        filename: 'Upload student list as .csv file with no header',
        selectedFile: null,
    })
    const [wrongFileExtn, setWrongFileExtn] = useState(false)
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const codewordStudentCount = () => {
        console.log('Calc')
        if(state.values || typeof state.values != 'undefined'){
        var codewordCount = state.values.substring(state.values.indexOf('('), state.values.indexOf(')'))
        console.log(codewordCount)
        }
        if(typeof studentCount != 'undefined' && studentCount.validRecords ){
        var studentCount = students.validRecords.length
        console.log(studentCount)
        }
    }

    const [codeword, setCodeword] = useState([{
        codewordSetName: '',
        count: 0,
        codewords: []
    }])
    const [invalidRecord, setInvalidRecord] = useState({
        invalidRecords: [],
        duplicateEmails: []
    })
    const [openReport, setOpenReport] = useState(false)
    const [publishedCodewordset, SetPublishedCodewordset] = useState([{
        codeWordSetName: ''
    }])
    useEffect(() => {
        console.log('getdata')

        const headers = {
            'Content-Type': 'application/json',
            'token': state.token
        };
        API.get('dashboard/getcodewordset', { headers: headers }).then(response => {
            if (response.data.code == 200) {
                setCodeword(
                    response.data.data.map((codewordSet) => {
                        console.log(codewordSet)
                        return {
                            codewordSetName: codewordSet.codewordSetName,
                            count: codewordSet.count,
                            codewords: codewordSet.codewords,
                            isPublished: codewordSet.isPublished
                        }
                    })
                )
                console.log('*******published codewordset')
                console.log(response.data.data.filter((item) => {
                    if (item.isPublished) {
                        return item
                    }
                }
                ))
                SetPublishedCodewordset(response.data.data.filter((item) => {
                    if (item.isPublished) {
                        return { codewordSetName: item.codewordSetName, count: item.codewords.length }
                    }
                }
                ))
                console.log(response.data.data)
            }

        })

    }, [])



    const handleChange = name => (event, isChecked) => {
        //console.log({[name]: event.target.value})
        setState({ ...state, [name]: event.target.value });
        if (name == 'startSurvey') {
            //console.log(event.target.value+' '+Validator.isURL(event.target.value))
            var isUrl = Validator.isURL(event.target.value)
            setError({
                startSurvey: {
                    status: !isUrl,
                    helperText: !isUrl ? 'Invalid Url' : ''
                },
                endSurvey: error.endSurvey
            })

        }
        if (name == 'endSurvey') {
            //console.log(event.target.value+' '+Validator.isURL(event.target.value))
            var isUrl = Validator.isURL(event.target.value)
            setError({
                endSurvey: {
                    status: !isUrl,
                    helperText: !isUrl ? 'Invalid Url' : ''
                },
                startSurvey: error.startSurvey
            })

        }
        if ([name] == 'values') {
            console.log('inise code')
            var selectedCodewordset = codeword.filter((item) => {
                if (item.codewordSetName == event.target.value) {
                    return item.count
                }
            })
            console.log('selected codeword set count')
            console.log(selectedCodewordset[0].count)
            setCodewordSetCount(selectedCodewordset[0].count)
            if (students.validRecords && students.validRecords.length > 0) {
                console.log('calculate')
                console.log(students.validRecords.length - selectedCodewordset[0].count)

                countAlert(students.validRecords.length, selectedCodewordset[0].count)
            }





        }

    }

    useEffect(() => {
        console.log('filename')
        console.log(file.filename)
        var fileSplits = file.filename.split('.')
        var fileExtn = fileSplits[fileSplits.length - 1]


        if (file.selectedFile !== null) {
            let removeDuplicateEmails
            if (fileExtn === 'csv') {
                setWrongFileExtn(false)
                Papa.parse(file.selectedFile, {
                    complete: function (results) {
                        console.log('*************CSV***********')
                        console.log(results)
                        var results = results.data.filter((item) => {
                            if (item[0] !== '' && item[1] !== '') {
                                return {
                                    name: item[0],
                                    email: item[1]
                                }
                            }
                        })
                        var invalidRecords = []
                        var validRecords = results.filter((item) => {
                            if (checkInput(item[0], item[1])) {
                                return {
                                    name: item[0],
                                    email: item[1]
                                }
                            } else {
                                invalidRecords.push({
                                    name: item[0],
                                    email: item[1]
                                })
                            }
                        })
                        console.log(validRecords)
                        let duplicateEmails = validRecords.filter((obj, pos, arr) => {
                            return arr.map(mapObj => mapObj[1]).indexOf(obj[1]) !== pos;
                        });
                        console.log(duplicateEmails)
                        removeDuplicateEmails = validRecords.filter((obj, pos, arr) => {
                            return arr.map(mapObj => mapObj[1]).indexOf(obj[1]) === pos;
                        });
                        console.log(removeDuplicateEmails)
                        setStudents({
                            validRecords: removeDuplicateEmails
                        })

                        setInvalidRecord({

                            invalidRecords: invalidRecords,
                            duplicateEmails: duplicateEmails
                        }
                        )

                        console.log(removeDuplicateEmails.length)
                        setStudentCount(removeDuplicateEmails.length)
                        if (state.values != "") {
                            countAlert(removeDuplicateEmails.length, codewordSetCount)
                        }

                    }


                })
            } else {
                setWrongFileExtn(true)
            }

            codewordStudentCount()

        }
    }, [file, wrongFileExtn])

    const handleFileChange = (event) => {
        if (fileLabel.current.files[0] && fileLabel.current.files[0].name) {
            setFile({ filename: fileLabel.current.files[0].name, selectedFile: event.target.files[0] });

        }

    }

    const handleStudentCountErrorClose = () => {
        setCodewordStudentCountError({
            open: false,
            message: ''
        })
    }
    const handleDateChange = name => (date) => {
        setState({ ...state, [name]: date });
    }


    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        const headers = {

            'token': sessionStorage.getItem('token')
        };

        var codewords = codeword.filter((item) => {
            if (state.values == item.codewordSetName) {
                return item.codewords
            }
        })
        var data = {
            courseNameKey: state.courseName,
            startDate: state.startDate,
            endDate: state.endDate,
            preSurveyURL: state.startSurvey,
            postSurveyURL: state.endSurvey,
            codewordSet: codewords,
            students: students.validRecords
        }
        console.log('********ADD COURSE*********')
        console.log(data)

        API.post('dashboard/addnewCourse', data, { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);
            if (response.data.code == 200) {

                setState({
                    status: true,
                    message: 'Course Created Successfully',
                    reRender: true,
                    snackcolor: {
                        backgroundColor: lightGreen[800]
                    }
                })

            } else {
                console.log('error')
                setState({
                    courseName: state.courseName,
                    startDate: state.startDate.toLocaleTimeString(),
                    endDate: state.endDate.toLocaleTimeString(),
                    status: true,
                    error: true,
                    message: response.data.message,
                    snackcolor: {
                        backgroundColor: red[800]
                    }
                })
            }
            setLoading(false)
        })
            .catch(error => {
                console.log(error)
                console.log('error')
                setState({
                    courseName: state.courseName,
                    startDate: state.startDate,
                    endDate: state.endDate,
                    status: true,
                    error: true,
                    message: error.message,
                    snackcolor: {
                        backgroundColor: red[800]
                    }
                })
            });

    }

    const getFileData = async (file) => {

    }
    const checkInput = (name, email) => {
        if (!name || !email || name == '' || email == '') {
            return false
        }
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if ((name.length > 50 || name.length < 1) && !emailRegex.test(email)) {
            return false
        }
        return true
    }
    const handleClose = () => {
        // console.log(studentCount + '  ' + codewordCount)
        // console.log(((parseFloat(studentCount) - parseFloat(codewordCount)) / parseFloat(codewordCount)))
        props.onClose()

    }

    const handleMessageClose = () => {
        setState({
            courseName: state.courseName,
            startDate: state.startDate,
            endDate: state.endDate,
            status: false
        })
        if (!state.error) {
            props.onClose(state.error)
        }
    }

    const handleCodewordStudentErrorClose = () => {

    }
    AddCourse.propTypes = {
        onClose: PropTypes.func.isRequired
    };


    function countAlert(studentCount, codewordCount) {
        var diff = codewordCount - studentCount
        var ratio = (diff) / (studentCount * 100)
        var x = ((diff) == 0 ? null : (diff))
        console.log(ratio + ' ' + diff)
        if (diff < 0) {
            setCodewordStudentCountError({
                open: true,
                message: 'Codeword count is less than the student count. You will not be able to finalize this course'
            })
        }
        else if (diff >= 0 && (ratio) < 0.2) {
            setCodewordStudentCountError({
                open: true,
                message: '' +
                    (x == null ? 'There is no difference between codewords and students. There will be problem if you try to add any more student' : 'The difference between codeword and student is less.There will be problem if you try to add more than ' + x + ' student')
            })
        }


        console.log('ratio')
        console.log(ratio)

    }



    const handleReportClose = () => {

        setOpenReport(false)
    }

    const handleReportOpen = () => {
        setOpenReport(true)
    }
    return (

        <div>
            <div>
                <Box display="flex" style={{ width: '100%' }} justifyContent="space-between">
                    <Typography component="div">
                        <Box fontSize={18} style={{ margin: 10 }}>
                            ADD COURSE
                    </Box>

                    </Typography>

                    {(invalidRecord.duplicateEmails.length > 0 || invalidRecord.invalidRecords.length > 0) &&
                        <Button
                            onClick={handleReportOpen}
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.reportButton}
                        >
                            Open Report
          </Button>
                    }
                </Box>
            </div>
            <div maxWidth="sm" className={classes.root}>
                <CssBaseline />

                <form enctype="multipart/form-data" onSubmit={handleSubmit} className={classes.form} >
                    <div className={classes.paper}>
                        <TextField className={classes.textField}
                            variant="outlined"
                            required
                            fullWidth
                            id="courseName"
                            label="Course Name"
                            name="courseName"
                            autoComplete="courseName"
                            autoFocus
                            margin="dense"
                            onChange={handleChange('courseName')}
                            value={state.firstName}
                        />
                        <input
                            accept=".csv"
                            className={classes.input}
                            id="text-button-file"
                            multiple
                            type="file"
                            ref={fileLabel}
                            onChange={handleFileChange}
                            onClick={(event) => event.target.value = ''}
                        />
                        <label htmlFor="text-button-file">
                            <Grid container spacing={1}>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                    <TextField fullWidth="true" className={classes.textField}
                                        id="filename"
                                        name="filename"
                                        disabled="true"
                                        margin="dense"
                                        value={file.filename}
                                        helperText="Example: John Smith, johnsmith@abc.com"
                                        style={{
                                            color: red[500]
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                    <Button size="small" variant="contained" component="span" color="primary" className={classes.button}>
                                        Upload
                                    <CloudUploadIcon className={classes.rightIcon} />
                                    </Button>
                                </Grid>
                                {
                                    (invalidRecord.duplicateEmails.length > 0 || invalidRecord.invalidRecords.length > 0) &&
                                    <Grid item xs={2} sm={2} md={2} lg={2}>
                                        <Box display="flex" m={0}>
                                            <Tooltip title="Open Report" placement="bottom">
                                                <IconButton
                                                    className={classes.iconButton}
                                                    onClick={handleReportOpen}
                                                    style={{ marginLeft: 25 }}
                                                >
                                                    <InfoIcon fontSize="inherit" style={{ color: red[600] }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Grid>
                                }

                                {
                                    (invalidRecord.duplicateEmails.length == 0 &&
                                        invalidRecord.invalidRecords.length == 0) &&
                                    students.validRecords.length > 0 &&
                                    <Chip
                                        label={'No invalid records'}
                                        size="small"
                                        className={classes.chip}
                                        color="primary"
                                        variant="outlined"
                                    />
                                }
                                {
                                    !wrongFileExtn && students.validRecords.length > 0 ?
                                        <Chip
                                            label={'Valid Records: ' + students.validRecords.length +
                                                '. '}
                                            size="small"
                                            className={classes.chip}
                                            color="primary"
                                            variant="outlined"
                                        /> : false
                                }
                                {!wrongFileExtn && invalidRecord.duplicateEmails.length > 0 ?

                                    <Chip
                                        label={'Duplicate Records: ' + invalidRecord.duplicateEmails.length}
                                        size="small"
                                        className={classes.chip}
                                        color="secondary"
                                        variant="outlined"
                                    /> : false
                                }
                                {!wrongFileExtn && invalidRecord.invalidRecords.length > 0 ?
                                    <Chip
                                        label={'Invalid Records: ' + invalidRecord.invalidRecords.length}
                                        size="small"
                                        className={classes.chip}
                                        color="secondary"
                                        variant="outlined"
                                    /> : false
                                }
                                {
                                    wrongFileExtn ? <Chip
                                        label={'Wrong File Extension. Only csv file is allowed'}
                                        size="small"
                                        className={classes.chip}
                                        color="secondary"
                                        variant="outlined"
                                    /> :
                                        students.validRecords.length < 1 && invalidRecord.invalidRecords.length > 0 ?
                                            <Chip
                                                label={'No valid records found'}
                                                size="small"
                                                className={classes.chip}
                                                color="secondary"
                                                variant="outlined"
                                            /> : false
                                }
                            </Grid>

                        </label>

                        <FormControl margin='dense' fullWidth="true" variant="outlined" className={classes.formControl}>
                            <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                                Codeword Set
                            </InputLabel>
                            <Select
                                value={state.values}
                                onChange={handleChange('values')}
                                input={<OutlinedInput labelWidth={labelWidth} name="Codeword Set" id="outlined-age-simple" />}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {publishedCodewordset.map((codewordSet) => {
                                    return <MenuItem value={codewordSet.codewordSetName}>{codewordSet.codewordSetName
                                        + ' (' + codewordSet.count + ')'}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container spacing={2}>

                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                    <TextField style={{ marginTop: 25 }}
                                        error={error.startSurvey.status}
                                        helperText={error.startSurvey.helperText}
                                        variant="outlined"
                                        fullWidth
                                        id="startSurvey"
                                        label="Start Survey"
                                        name="startSurvey"
                                        autoComplete="startSurvey"
                                        margin="dense"
                                        onChange={handleChange('startSurvey')}
                                        value={state.startSurvey}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                    <KeyboardDatePicker
                                        variant="normal"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="start-date"
                                        label="Start Date"
                                        value={state.startDate}
                                        onChange={handleDateChange('startDate')}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>

                            </Grid>
                        </MuiPickersUtilsProvider>

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container spacing={2}>

                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                    <TextField
                                        error={error.endSurvey.status}
                                        helperText={error.endSurvey.helperText}
                                        style={{ marginTop: 25 }}
                                        variant="outlined"
                                        fullWidth
                                        id="endSurvey"
                                        label="End Survey"
                                        name="endSurvey"
                                        autoComplete="endSurvey"
                                        margin="dense"
                                        onChange={handleChange('endSurvey')}
                                        value={state.endSurvey}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                    <KeyboardDatePicker
                                        variant="normal"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="end-date"
                                        minDate={state.startDate}

                                        label="End Date"
                                        value={state.endDate}
                                        onChange={handleDateChange('endDate')}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>

                            </Grid>
                        </MuiPickersUtilsProvider>



                    </div>

                    <Box display="flex" justifyContent="flex-end">
                        <div className={classes.wrapper}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="inherit"
                                className={classes.cancel}
                                onClick={handleClose}
                            >
                                Cancel
          </Button>
                        </div>
                        <div className={classes.wrapper}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="inherit"
                                className={classes.submit}
                                disabled={state.courseName == '' || wrongFileExtn || loading || error.endSurvey.status || error.startSurvey.status}
                            >
                                Add
          </Button>
                            {loading && <CircularProgress size={28} className={classes.buttonProgress} />}
                        </div>


                    </Box>


                </form>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    TransitionComponent={Slide}
                    TransitionProps={
                        { direction: "right" }
                    }
                    open={state.status}
                    autoHideDuration={2000}
                    variant="success"
                    onClose={handleMessageClose}
                    message={state.message}
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
                >
                    <SnackbarContent style={state.snackcolor}
                        message={<span id="client-snackbar">{state.message}</span>}
                    />
                </Snackbar>
            </div>


            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={openReport}
                onClose={handleClose}
                disableBackdropClick
                className={classes.modal}
            >
                <Paper className={classes.report}>
                    <DialogTitle id="alert-dialog-slide-title">{"Report"}</DialogTitle>
                    <Divider />
                    <DialogContent>
                        Note: <ul>
                            <li>Name or Email cannot be blank </li>
                            <li>Name should only contain letters or numbers</li>
                            <li>Name cannot exceed 50 characters</li>
                            <li>Email id should not be in wrong format</li>
                        </ul>
                        <DialogContentText id="alert-dialog-slide-description">
                            Duplicate Records: {invalidRecord.duplicateEmails.length}
                        </DialogContentText>
                        <Grid container >
                            {invalidRecord.duplicateEmails.map((item) => {
                                return <Typography component="div">
                                    <Box fontSize="caption.fontSize" fontWeight="fontWeightBold" m={1}>
                                        {item}
                                    </Box>
                                </Typography>
                            })
                            }
                        </Grid>

                        <DialogContentText id="alert-dialog-slide-description">
                            Invalid records: {invalidRecord.invalidRecords.length}

                        </DialogContentText>
                        <Grid container >
                            {
                                invalidRecord.invalidRecords.map((item) => {
                                    return <Typography component="div">
                                        <Box fontSize="caption.fontSize" fontWeight="fontWeightBold" m={1}>
                                            {item.email} - {item.name}
                                        </Box>
                                    </Typography>
                                })
                            }
                        </Grid>

                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={handleReportClose} color="primary">
                            OK
           </Button>
                    </DialogActions>

                </Paper>
            </Modal>

            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={codewordStudentCountError.open}
                onClose={handleStudentCountErrorClose}
                disableBackdropClick
                className={classes.modal}
            >
                <Paper className={classes.alertreport}>
                    <DialogTitle id="alert-dialog-slide-title">{"Warning"}</DialogTitle>
                    <Divider />
                    <DialogContent>

                        <DialogContentText id="alert-dialog-slide-description">
                            {codewordStudentCountError.message}
                        </DialogContentText>

                        <Grid container >

                        </Grid>

                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={handleStudentCountErrorClose} color="primary">
                            OK
           </Button>
                    </DialogActions>

                </Paper>
            </Modal>

        </div>
    );
}

