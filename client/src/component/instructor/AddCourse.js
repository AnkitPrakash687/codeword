import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import {
    Paper, Grid, Button, FormControl, InputLabel, CircularProgress, Modal, Tooltip,
    MenuItem, OutlinedInput, Select, Box, Snackbar, IconButton, Chip, Slide,
    Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Divider
} from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import API from '../../utils/API'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
import { flexbox, maxHeight } from '@material-ui/system';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import InfoIcon from '@material-ui/icons/Info';

const Papa = require('papaparse')
var moment = require('moment');
var _ = require("underscore");
const useStyles = makeStyles(theme => ({
    root: {
      
    },
    form:{
        padding: theme.spacing(1,5,1,5),
        background: grey[100]
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
        marginTop: theme.spacing(1),
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
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],


    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        alertOpen: true
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
        filename: '',
        selectedFile: null,
    })
    const [wrongFileExtn, setWrongFileExtn] = useState(false)
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

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
    const [studentCount, setStudentCount] = useState('empty')
    const [codewordCount, SetCodewordCount] = useState('empty')
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
        if ([name] == 'values') {
            console.log('inise code')
            var count = codeword.filter((item) => {
                if (item.codewordSetName == event.target.value) {
                    return item.count
                }
            })

            if (count.length > 0) {
                SetCodewordCount(count[0].count)
            } else {
                SetCodewordCount('empty')
            }

        }

    }

    useEffect(() => {
        console.log('filename')
        console.log(file.filename)
        var fileSplits = file.filename.split('.')
        var fileExtn = fileSplits[fileSplits.length - 1]


        if (file.selectedFile !== null) {
            if (fileExtn === 'csv') {
                setWrongFileExtn(false)
                Papa.parse(file.selectedFile, {
                    complete: function (results) {
                        console.log('*************CSV***********')
                        console.log(results)
                        var results = results.data.filter((item)=>{
                            if(item[0] !== '' && item[1] !== ''){
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
                        let removeDuplicateEmails = validRecords.filter((obj, pos, arr) => {
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

                    }
                })
            } else {
                setWrongFileExtn(true)
            }
        }
    }, [file, wrongFileExtn])

    const handleFileChange = (event) => {
        if (fileLabel.current.files[0] && fileLabel.current.files[0].name) {
            setFile({ filename: fileLabel.current.files[0].name, selectedFile: event.target.files[0] });

        }
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
                    reRender: true
                })

            } else {
                console.log('error')
                setState({
                    courseName: state.courseName,
                    startDate: state.startDate,
                    endDate: state.endDate,
                    status: true,
                    error: true,
                    message: response.data.message,
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
                    message: error.message
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

    const handleDelete = () => {

    }
    AddCourse.propTypes = {
        onClose: PropTypes.func.isRequired
    };


    function countAlert(props) {
        const { message, open, handleClose } = props
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        OK
            </Button>
                </DialogActions>
            </Dialog>
        )
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
                <Typography component="div">
                    <Box fontSize={18} style={{margin: 10}}>
                    ADD COURSE
                    </Box>
                   
                </Typography>
                </div>
            <div  maxWidth="sm" className={classes.root}>
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
                                        helperText="only .csv file is allowed - name and email with no header"
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
                                                style={{marginLeft: 25}}
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
                                            label={'Valid Records: ' + students.validRecords.length+
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

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container spacing={5}>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
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
                                <Grid item xs={6} sm={6} md={6} lg={6}>
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
                        <TextField className={classes.textField}
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
                        <TextField className={classes.textField}
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
                                disabled={wrongFileExtn || loading}
                            >
                                Add
          </Button>
                            {loading && <CircularProgress size={28} className={classes.buttonProgress} />}
                        </div>


                    </Box>


                </form>
              
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
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
                ></Snackbar>
                {/* { 
            ((parseFloat(studentCount)-parseFloat(codewordCount))/parseFloat(codewordCount)) < 0.1 ?
            <Dialog
        open={alertOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {'message'}
        </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleAlertClose} color="primary" autoFocus>
                OK
            </Button>
        </DialogActions>
    </Dialog>
            :
            (codewordCount-studentCount) < 0?
            <countAlert open={true} handleClose={handleClose('alertOpen')} message="Student count exceeds codeword count"></countAlert>:false
            }
          */}

                {/* <Dialog
           fullWidth={true} 
           closeAfterTransition={true}
        open={openReport}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Report"}</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Duplicate Records: {invalidRecord.duplicateEmails.length}
            </DialogContentText>
            <Grid container >
           { invalidRecord.duplicateEmails.map((item)=>{
                   return  <Typography component="div">
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
                invalidRecord.invalidRecords.map((item)=>{
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
      </Dialog> */}




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
        </div>
    );
}

