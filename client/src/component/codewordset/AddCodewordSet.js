import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import {
    Paper, Grid, Button, FormControl, InputLabel,
    MenuItem, OutlinedInput, Select, Box, Snackbar, IconButton, Chip, 
    Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Slide, Divider
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

const Papa = require('papaparse')
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
    chipContainer:{
        margin: theme.spacing(2)
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
        marginRight: theme.spacing(1)
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
        background: lightGreen[100],
        padding: theme.spacing(1),
        borderRadius: 5
    }
}));

export default function AddCodewordSet(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        role: '',
        token: sessionStorage.getItem('token'),
        codewordSetName: '',
        studentFilename: '',
        filename: '',
        selectedFile: null,
        status: false,
        error: false,
        message: '',
        reRender: false,
        alertOpen: true
    })
   
    const [openReport, setOpenReport] = useState(false)
    const [hardRuleData, setHardRuleData] = useState({
        moreThanThree: [],
        lessThanThree: [],
        duplicates: [],
        filteredData: [],
        invalidCodewords: []
    })

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
      });

    const fileLabel = React.useRef(null)

    const handleChange = name => (event, isChecked) => {
        //console.log({[name]: event.target.value})
        setState({ ...state, [name]: event.target.value });

    }

    const handleFileChange = (event) => {
        if (fileLabel.current.files[0] && fileLabel.current.files[0].name) {
            setState({ ...state, filename: fileLabel.current.files[0].name, selectedFile: event.target.files[0] });
            let file = event.target.files[0]
            let fileExt = file.name.split('.')[1]
            if(fileExt == 'csv'){
            // Papa.parse(event.target.files[0], {
            //     complete: function (results) {
            //         console.log(results)
            //         var students = results.data.filter((item) => {
            //             if (item[0] != '') {
            //                 return item
            //             }
            //         })
                
            //     }
            // })
            }else if(fileExt == 'txt'){
                
                let reader = new FileReader()
                reader.readAsText(file)
                reader.onload = () =>{
                     var result = reader.result.split('\n')
                     console.log(result)
                     var codewordSetData = result.map((item)=>{
                         return item.replace(/[\r]+/g,"")
                     })
                     console.log(codewordSetData)
                    filterData(codewordSetData)
                }
               
            }else{

            }

        }

        const filterData = (result) => {

            let lessThanThree = []
            let moreThanThree = []
            var letters = /[/\s/\t/!@#$%^&*(),.?":;'{}|<>0-9\\\\]/

            let invalidCodewords = result.filter((item)=>{
                return item.search(letters) != -1
            })
            let array = result.filter((item, index)=>{
                 return item.search(letters) == -1
            })
            console.log('******array********')
            console.log(array)
            console.log(invalidCodewords)

            let duplicateWords = array.filter((item, index) => 
                array.indexOf(item) !== index
            )
    
            for(let i in array){
                if(array[i].length < 3){
                    lessThanThree.push(array[i])
                }else{
                    moreThanThree.push(array[i])
                }
            }
            
            let filteredData = Array.from(new Set(moreThanThree))
            console.log(moreThanThree)
            console.log(filteredData)
            setHardRuleData({
                moreThanThree: moreThanThree,
                lessThanThree: lessThanThree,
                duplicates: duplicateWords,
                filteredData: filteredData,
                invalidCodewords: invalidCodewords
            })

            
        }
    }

    const handleDateChange = name => (date) => {
        setState({ ...state, [name]: date });
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        var data = {
            codewordSetName: state.codewordSetName,
            codewords: hardRuleData.filteredData
        }
        console.log(data)
        
        API.post('dashboard/addcodewordset',  data, { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);
            if (response.status == 200) {
              
                if(hardRuleData.lessThanThree.length > 0 || hardRuleData.invalidCodewords.length > 0
                    || hardRuleData.duplicates.length > 0){
                setOpenReport(true)
                    }else{
                        setState({
                            status: true,
                            message: "Codeword Set created!",
                            reRender: true
                        })
                    }
            } else {
                console.log('error')
                setState({
                    codewordSetName: state.codewordSetName,
                    status: true,
                    error: true,
                    message: response.data.message,
                })
            }
        })
            .catch(error => {
                console.log(error)
                console.log('error')
                setState({
                    codewordSetName: state.codewordSetName,
                    status: true,
                    error: true,
                    message: error.message
                })
            })
            ;



    }

    const handleReportClose = () =>{
        setOpenReport(false)
        setState({
            status: true,
            message: "Codeword Set created!",
            reRender: true
        })
       
    }
    const handleClose = () => {
       
        props.onClose()
    
    }

    const handleMessageClose = () => {
        setState({
            codewordSetName: state.codewordSetName,
            status: false
        })
        if (!state.error) {
            props.onClose(state.error)
        }
    }


    AddCodewordSet.propTypes = {
        onClose: PropTypes.func.isRequired
    };

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />


            <form enctype="multipart/form-data" onSubmit={handleSubmit} className={classes.form} >
                <div className={classes.paper}>
                    <TextField className={classes.textField}
                        variant="outlined"
                        required
                        fullWidth
                        id="codewordSetName"
                        label="Codeword Set Name"
                        name="codewordSetName"
                        autoFocus
                        margin="dense"
                        onChange={handleChange('codewordSetName')}
                        value={state.codewordSetName}
                    />
                    <input
                        accept=".txt,.csv"
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
                                    value={state.filename}
                                />
                            </Grid>
                            <Grid item xs={4} sm={4} md={4} lg={4}>
                                <Button variant="contained" component="span" color="primary" className={classes.button}>
                                    Upload
                                    <CloudUploadIcon className={classes.rightIcon} />
                                </Button>
                            </Grid>
                        </Grid>

                    </label>

                  
                </div>
                <Grid container className={classes.chipContainer}>
                       { (hardRuleData.duplicates.length > 0) &&
                       <Grid item>
                        <Chip
                            label={'No. of duplicate: ' + hardRuleData.duplicates.length}
                            size="small"
                            className={classes.chip}
                            color="primary"
                            variant="outlined"
                        /> 
                        </Grid>
                       }
                       { (hardRuleData.lessThanThree.length > 0) &&
                        <Grid item>
                        <Chip
                            label={'Less than 3 letters: ' + hardRuleData.lessThanThree.length}
                            size="small"
                            className={classes.chip}
                            color="primary"
                            variant="outlined"
                        /> 
                        </Grid>
                       } 
                       { (hardRuleData.invalidCodewords.length > 0) &&
                        <Grid item>
                        <Chip
                            label={'Invalid Codewords: ' + hardRuleData.invalidCodewords.length}
                            size="small"
                            className={classes.chip}
                            color="primary"
                            variant="outlined"
                        /> 
                        </Grid>
                       } 
                       </Grid>
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
                    >
                        Add
          </Button>

                </Box>

               
            </form>

            <Dialog
           fullWidth={true} 
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
            Duplicate Codewords: {hardRuleData.duplicates.length}
            </DialogContentText>
            <Grid container >
           { hardRuleData.duplicates.map((item)=>{
                   return  <Typography component="div">
                    <Box fontSize="caption.fontSize" fontWeight="fontWeightBold" m={1}>
                        {item}
                    </Box>
                </Typography>
                })
            }
          </Grid>
    
          <DialogContentText id="alert-dialog-slide-description">
            Codewords with less than three letters: {hardRuleData.lessThanThree.length}
            </DialogContentText>
            <Grid container >
            {
                hardRuleData.lessThanThree.map((item)=>{
                   return <Typography component="div">
                    <Box fontSize="caption.fontSize" fontWeight="fontWeightBold" m={1}>
                        {item}
                    </Box>
                </Typography>
                })
            }
            </Grid>
        
            <DialogContentText id="alert-dialog-slide-description">
            Invalid codewords: {hardRuleData.invalidCodewords.length}
            </DialogContentText>
            <Grid container >
            { hardRuleData.invalidCodewords.map((item)=>{
                   return  <Typography component="div">
                    <Box fontSize="caption.fontSize" fontWeight="fontWeightBold" m={1}>
                        {item}
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
      </Dialog>
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

