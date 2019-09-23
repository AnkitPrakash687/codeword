import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import {
    Paper, Grid, Button, FormControl, InputLabel,
    MenuItem, OutlinedInput, Select, Box, Snackbar, IconButton, CircularProgress
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
import { flexbox } from '@material-ui/system';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

var moment = require('moment');
var _ = require("underscore");
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
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
      },
      buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
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
    submit: {
        background: green[600],
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        "&:hover": {
            backgroundColor: "green"
        }
    },
    cancel: {
        background: red[600],
        margin: theme.spacing(2),
        "&:hover": {
            backgroundColor: "red"
        }
    },
    paper: {
        background: grey[200],
        padding: theme.spacing(1),
        borderRadius: 5
    }
}));

export default function EditCourse(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        role: '',
        token: sessionStorage.getItem('token'),
        id: props.data.id,
        courseName: props.data.courseName,
        startSurvey: props.data.startSurvey=='Unpublished'?'':props.data.startSurvey,
        endSurvey: props.data.startSurvey=='Unpublished'?'':props.data.startSurvey,
        startDate: props.data.startDate,
        endDate:props.data.endDate,
        selectedDate: '',
        values: '',
        studentFilename: '',
        filename: '',
        selectedFile: null,
        status: false,
        error: false,
        message: '',
        reRender: false
    })
    const [publishedCodewordset,SetPublishedCodewordset] = useState([{
        codewordSetName: ''
    }])
    const [course, setCourse] = useState({
        courseName: props.data.courseName,
        startSurvey: props.data.startSurvey=='Unpublished'?'':props.data.startSurvey,
        endSurvey: props.data.endSurvey=='Unpublished'?'':props.data.endSurvey,
        startDate: props.data.startDate,
        endDate:props.data.endDate,
        codewordSet: props.data.codewordset,
        isAssigned: props.data.isAssigned,
        filename: state.filename
    })
    const inputLabel = React.useRef(null);
    const fileLabel = React.useRef(null)
    const [disableUpdate, setDisableUpdate] = useState('true')
    const [labelWidth, setLabelWidth] = React.useState(0);
    const [disableField, setDisableField] = useState(false)
    const [loading, setLoading] = useState(false)
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        if(props.data.isAssigned){
        setDisableField(true)
        }
    }, []);

    const data = {
        courseName: props.data.courseName,
        startSurvey: props.data.startSurvey=='Unpublished'?'':props.data.startSurvey,
        endSurvey: props.data.endSurvey=='Unpublished'?'':props.data.endSurvey,
        startDate: props.data.startDate,
        endDate:props.data.endDate,
        codewordSet: props.data.codewordset,
        isAssigned: props.data.isAssigned,
    }
    useEffect(() => {
       console.log(data)
       console.log(course)
       if(course.isAssigned){
        setDisableField(true)
        if(data.startSurvey == course.startSurvey
            && data.endSurvey == course.endSurvey ){
                setDisableUpdate('true')
            }else{
                setDisableUpdate(false)
            }
       }else{
        if(data.courseName == course.courseName && data.startSurvey == course.startSurvey
            && data.endSurvey == course.endSurvey && data.startDate == course.startDate && 
            data.endDate == course.endDate && data.codewordSet == course.codewordSet && course.filename == ''){
                setDisableUpdate('true')
            }else{
                setDisableUpdate(false)
            }
        }
    },[course])

    const handleChange = name => (event, isChecked) => {
        //console.log({[name]: event.target.value})
        setCourse({ ...course, [name]: event.target.value });
    }
    const handleFileChange = (event) => {
        if (fileLabel.current.files[0] && fileLabel.current.files[0].name)
        setCourse({...course, filename:fileLabel.current.files[0].name})    
        setState({ ...state, filename: fileLabel.current.files[0].name, selectedFile: event.target.files[0] });
    }

    const handleDateChange = name => (date) => {
        
        var formattedDate = date.toISOString().substring(0,10)
        console.log(date)
        console.log(formattedDate)
        setCourse({ ...course, [name]: formattedDate });
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const headers = {
            "Content-Type": "multipart/form-data",
            'token': sessionStorage.getItem('token')
        };
        var data = {
            id:  props.data.id,
            courseNameKey: course.courseName,
            startDate: course.startDate,
            endDate: course.endDate,
            preSurveyURL: course.startSurvey,
            postSurveyURL: course.endSurvey,
            codewordSetName: course.codewordSet,

        }
        console.log(data)
        var formData = new FormData()
        formData.append('file', state.selectedFile)
        _.each(data, (value, key) => {
            console.log(key + " " + value)
            formData.append(key, value)
        })

        API.post('dashboard/updateCourse', formData, { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);
            if (response.status == 200) {
                setState({
                    status: true,
                    message: response.data.message,
                    reRender: true
                })
            } else {
                console.log('error')
                setCourse({
                    courseName: course.courseName,
                    startDate: course.startDate,
                    endDate: course.endDate
                })

                setState({
                    status: true,
                    error: true,
                    message: response.data.message
                })
            }
        })
            .catch(error => {
                console.log(error)
                console.log('error')
                setCourse({
                    courseName: course.courseName,
                    startDate: course.startDate,
                    endDate: course.endDate
                })

                setState({
                    status: true,
                    error: true,
                    message: error.message
                })
            })
            ;



    }

    const handleClose = () => {
      //  console.log(props.data)
        props.onClose()
    }

    const handleMessageClose = () => {
        setCourse({
            courseName: course.courseName,
            startDate: course.startDate,
            endDate: course.endDate,
            status: false
        })
        if (!state.error) {
            props.onClose(state.error)
        }
    }
    EditCourse.propTypes = {
        onClose: PropTypes.func.isRequired
    };

    const [codeword, setCodeword] = useState([{
        codewordSetName:'',
        count:0
    }])
    useEffect(() => {
        console.log('getdata')
        setLoading(true)
        const headers = {
            'Content-Type': 'application/json',
            'token':  state.token
          };
          API.get('dashboard/getcodewordset', { headers: headers }).then(response => {
            if(response.data.code == 200){
                setCodeword(
                    response.data.data.map((codewordSet)=>{
                        return {
                            codewordSetName: codewordSet.codewordSetName,
                            count: codewordSet.count
                        }
                    })
                    )
                    SetPublishedCodewordset(response.data.data.filter((item)=>{
                        if(item.isPublished){
                            return {codewordSetName: item.codewordSetName,
                                count: item.codewords.length}
                        }
                    }
                    ))
                    console.log(response.data.data)
                    setLoading(false)
            }
        })

    },[])

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />

            <div className={classes.paper}>
                <form enctype="multipart/form-data" onSubmit={handleSubmit} className={classes.form} >
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
                        value={course.courseName}
                        disabled={disableField}
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
                    {/* <label htmlFor="text-button-file">
                        <Grid container spacing={1}>
                            <Grid item xs={8} sm={8} md={8} lg={8}>
                                <TextField fullWidth="true" className={classes.textField}
                                    id="filename"
                                    name="filename"
                                    disabled="true"
                                    margin="dense"
                                    value={state.filename}
                                />
                            </Grid>
                            <Grid item xs={4} sm={4} md={4} lg={4}>
                                <Button  disabled={disableField} variant="contained" component="span" color="primary" className={classes.button}>
                                    Upload
                                    <CloudUploadIcon className={classes.rightIcon} />
                                </Button>
                            </Grid>
                        </Grid>

                    </label> */}

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container spacing={5}>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <KeyboardDatePicker
                                    disabled={disableField}
                                    variant="normal"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="start-date"
                                    label="Start Date"
                                    value={course.startDate}
                                    onChange={handleDateChange('startDate')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <KeyboardDatePicker
                                    disabled={disableField}
                                    variant="normal"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="end-date"
                                    minDate={course.startDate}

                                    label="End Date"
                                    value={course.endDate}
                                    onChange={handleDateChange('endDate')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>

                        </Grid>
                    </MuiPickersUtilsProvider>
                    <div className={classes.wrapper}>
                    <FormControl margin='dense' fullWidth="true" variant="outlined" className={classes.formControl}>
                        <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                            Codeword Set
                    </InputLabel>
                        <Select
                             disabled={disableField || loading}
                            value={course.codewordSet}
                            onChange={handleChange('codewordSet')}
                            input={<OutlinedInput labelWidth={labelWidth} name="Codeword Set" id="outlined-age-simple" />}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {publishedCodewordset.map((codewordSet)=>{
                                return <MenuItem value={codewordSet.codewordSetName}>{
                                    codewordSet.codewordSetName + ' (' + codewordSet.count + ')'
                                }</MenuItem>
                            })}
                        </Select>
                    </FormControl> 
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                    <TextField className={classes.textField}
                        variant="outlined"
                        fullWidth
                        id="startSurvey"
                        label="Start Survey"
                        name="startSurvey"
                        autoComplete="startSurvey"
                        margin="dense"
                        onChange={handleChange('startSurvey')}
                        value={course.startSurvey}
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
                        value={course.endSurvey}
                    />

                    <Box display="flex" justifyContent="flex-end">


                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.cancel}
                            onClick={handleClose}
                        >
                            Cancel
          </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.submit}
                            disabled={disableUpdate}
                        >
                            Update
          </Button>



                    </Box>


                </form>
            </div>
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
        </Container>
    );
}

