import { Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, 
    Divider, Grid, IconButton, Modal, Paper, Slide, Snackbar, Tooltip } from '@material-ui/core';
import { green, grey, lightGreen, red } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import API from '../../utils/API';

const Papa = require('papaparse')
var _ = require("underscore");
const useStyles = makeStyles(theme => ({
    root: {
       
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        background: green[600]
    },
    paper2: {
        
  
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
       
        marginBottom: theme.spacing(2),
        "&:hover": {
            backgroundColor: "green"
        }
    },
    cancel: {
        background: red[600],
        margin: theme.spacing(0,2,2,2),
        "&:hover": {
            backgroundColor: "red"
        }
    },
    paper: {

        background: grey[200],
         padding: theme.spacing(2),
        borderRadius: 5,
        marginTop: theme.spacing(2)
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
      },
      buttonProgress: {
        color: green[700],
        position: 'absolute',
        top: '38%',
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
    },
    reportButton:{
        margin: theme.spacing(2)
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
        alertOpen: false
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

    const handleFileOnClick = (event) =>{
        event.target.value = ''
        
    }

    const handleFileChange = (event) => {

        console.log('*******event******')
        console.log(event.target)
        if (event.target.files[0]) {
            setState({ ...state, filename: event.target.files[0].name, selectedFile: event.target.files[0] });
            let file = event.target.files[0]
            let fileExt = file.name.split('.')[1]
            if(fileExt == 'csv'){
            Papa.parse(event.target.files[0], {
                complete: function (results) {
                    console.log('********CSV file******')
                    console.log(results)
                    var codewordSetData = results.data.map((item)=>{
                        return item[0].trim().toLowerCase()
                    })
                    console.log(codewordSetData)

                   filterData(codewordSetData.filter((item)=>{
                       return item !== ""
                   }))
                
                }
            })
            }else if(fileExt == 'txt'){
                
                let reader = new FileReader()
                reader.readAsText(file)
                reader.onload = () =>{
                     var result = reader.result.split('\n')
                     console.log(result)
                     var codewordSetData = result.map((item)=>{
                         return item.replace(/[\r]+/g,"").trim().toLowerCase()
                     })
                     console.log(codewordSetData)

                    filterData(codewordSetData.filter((item)=>{
                        return item !== ""
                    }))
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

    const handleCodewordsetReportOpen = () =>{
        setOpenReport(true)
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

        console.log('***********Add codewordset**********')
        console.log(data)
        
        API.post('dashboard/addcodewordset',  data, { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);
            if (response.data.code == 200) {
              
             
                //setOpenReport(true)
                setState({
                    ...state,
                    status: true,
                    message: "Codeword Set created!",
                    reRender: true
                })
                  
            } 
            else if(response.data.message.code==11000){
                setState({
                    ...state,
                    status: true,
                    error: true,
                    message: 'Codeword set already registered',
                })
            }
            else {
                console.log('error')
                setState({
                    ...state,
                    status: true,
                    error: true,
                    message: 'Expected error',
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
        <div>

            <div>
                <Box display="flex" style={{width:'100%'}} justifyContent="space-between">
                <Typography component="div">
                    <Box fontSize={18} style={{margin: 10}}>
                    ADD CODEWORD SET
                    </Box>
                   
                </Typography>

                { (hardRuleData.duplicates.length > 0 || hardRuleData.lessThanThree.length > 0
                                || hardRuleData.invalidCodewords.length > 0) &&
            <Button
                        onClick={handleCodewordsetReportOpen}
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
                <Divider/>
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
                        onChange={handleFileChange}
                        onClick={handleFileOnClick}
                    />
                    <label htmlFor="text-button-file">
                        <Grid container spacing={1}>
                            <Grid item xs={8} sm={8} md={8} lg={8}>
                                <TextField fullWidth="true" className={classes.textField}
                                    id="filename"
                                    name="filename"
                                    disabled="true"
                                    margin="dense"
                                    helperText="*only .txt or .csv file is allowed. One Codeword per line"
                                    value={state.filename}
                                />
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2}>
                                <Button size="small" variant="contained" component="span" color="primary" className={classes.button}>
                                    Upload
                                    <CloudUploadIcon className={classes.rightIcon} />
                                </Button>
                                </Grid>
                                { (hardRuleData.duplicates.length > 0 || hardRuleData.lessThanThree.length > 0
                                || hardRuleData.invalidCodewords.length > 0) &&
                                  <Grid item xs={2} sm={2} md={2} lg={2}>
                                  <Box display="flex" m={0}>
                                <Tooltip title="Open Report" placement="bottom">
                                            <IconButton
                                                className={classes.iconButton}
                                                onClick={handleCodewordsetReportOpen}
                                                style={{marginLeft: 25}}
                                            >
                                                <InfoIcon fontSize="inherit" style={{ color: red[600] }} />
                                            </IconButton>
                                        </Tooltip>
                                        </Box>
                                        </Grid>
                                }
                        
                        </Grid>

                    </label>

                  
                </div>
                <Grid container className={classes.chipContainer}>
                    {   state.filename !== ''&&
                         <Grid item>
                         <Chip
                             label={'Valid codewords: ' + hardRuleData.filteredData.length}
                             size="small"
                             className={classes.chip}
                             color="primary"
                             variant="outlined"
                         /> 
                         </Grid>
                    }
                       { (hardRuleData.duplicates.length > 0) &&
                       <Grid item>
                        <Chip
                            label={'No. of duplicate: ' + hardRuleData.duplicates.length}
                            size="small"
                            className={classes.chip}
                            color="secondary"
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
                            color="secondary"
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
                            color="secondary"
                            variant="outlined"
                        /> 
                        </Grid>
                       } 
                       </Grid>
                <Box display="flex" justifyContent="flex-end">
                   
                    <Button
                        variant="contained"
                        color="primary"
                        size="inherit"
                        className={classes.cancel}
                        onClick={handleClose}
                    >
                        Cancel
          </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="inherit"
                        className={classes.submit}
                    >
                        Add
          </Button>

                </Box>

               
            </form>

            {/* <Dialog
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
      </Dialog> */}
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
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
            ></Snackbar>


            
        </Container>
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
        
                  </Paper>
            </Modal>
        </div>
    );
}

