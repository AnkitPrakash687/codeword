import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Appbar from '../MyAppBar'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red, grey, orange } from '@material-ui/core/colors';
import {
    Paper, Grid, Box, Slide, Button, Container, CssBaseline, Snackbar, CircularProgress,
    IconButton, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Tooltip
} from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import API from '../../utils/API'
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Redirect } from "react-router-dom";
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import EditCourse from '../instructor/EditCourse'
import CloseIcon from '@material-ui/icons/Close';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Report from './Report'
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import LockIcon from '@material-ui/icons/Lock';
import ListAltIcon from '@material-ui/icons/ListAlt';
import EditCodewordSet from './EditCodewordSet';
import MyAppBar from '../MyAppBar';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 20,
        flexGrow: 1,
        //  background: theme.palette.background.paper,
        background: lightGreen[200],
        minHeight: 500

    },
    header: {
        background: green[300],
        border: 1,
        borderRadius: 5,
        minHeight: 40

    },
    course: {
        margin: theme.spacing(4),
        background: grey[100],
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: grey[400],
        borderRadius: 10,
        minHeight: 100,
        maxWidth: 800,
        padding: theme.spacing(2)
    },
    table: {

        padding: theme.spacing(4),
        maxWidth: 600

    },
    assign: {
        margin: theme.spacing(1),
        background: lightGreen[500],
        "&:hover": {
            backgroundColor: "green"
        }
    },
    edit: {
        background: green[400],
        margin: theme.spacing(1),
        color: grey[900]
    },
    delete: {
        margin: theme.spacing(1),
        background: red[700],
        "&:hover": {
            backgroundColor: red[600]
        }
    },
    report: {
        margin: theme.spacing(5),
        background: lightGreen[100],

    },
    iconButton:{
        background: grey[300],
        margin: theme.spacing(1),
        color: grey[900]
    },
    iconButtonDelete:{
        background: grey[300],
        margin: theme.spacing(1),
        color: red[900]
    },
    appBar: {
        borderRadius: 5,
        background: green[600]
    },
    paper: {
        borderRadius: 5,
        paddingBottom: 20
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
export default function CodewordSet(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        id: props.match.params.id,
        codewordSetName: '',

    })

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const [snack, setSnack] = useState({
        message: '',
        open: false
    })
    const [table, setTable] = useState({
        columns: [
            { title: 'Name', field: 'name' },
            { title: 'Email', field: 'email' }
        ],
        data: [],
    })
    const [open, setOpen] = useState(false)
    const [render, setRender] = useState(false)
    const [disableEdit, setDisableEdit] = useState(false)
    const [openReport, setOpenReport] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.get('dashboard/getacodewordset/' + props.match.params.id, { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);

            if (response.status == 200) {
                console.log(response.data)
                var codewordSet = response.data.data
                var codewords = codewordSet.codewords.map((item) => {
                    return { codeword: item }
                })

                setTable({
                    columns: [
                        { title: 'Codeword', field: 'codeword' },
                    ],
                    data: codewords
                })

                setState({
                    id: codewordSet._id,
                    codewordSetName: codewordSet.codewordSetName,
                    count: codewordSet.count,
                    isPublished: codewordSet.isPublished
                })
                console.log(codewordSet)
                if (codewordSet.isPublished) {
                    setDisableEdit(true)
                }
            }
            setLoading(false)
        })
            .catch(error => {
                console.log(error)
            })
    }, [render])


    const [redirect, setRedirect] = useState(false);
    const handleCardClick = () => {
        console.log('click working')
        setRedirect(true)

    }
    if (redirect) {
        return <Redirect to="/"></Redirect>
    }

    const handleMessageClose = () => {

        setSnack({
            message: '',
            open: false
        })
    }

    const checkCodeword = (codeword) => {
        console.log('check')
        let codewords = table.data.map((item) => {
            return item.codeword
        })
        console.log(codewords)
        codewords.push(codeword)
        console.log(codeword.length)
        var letters = /[/\s/\t/!@#$%^&*(),.?":;'{}|<>0-9\\\\]/
        let duplicateWords = codewords.filter((item, index) =>
            codewords.indexOf(item) !== index
        )
        console.log(duplicateWords)
        if (codeword.length < 3) {
            return 'Codeword less than 3 letters'
        }

        else if (codeword.search(letters) != -1) {
            return 'Codeword contains invalid character'
        }
        else if (duplicateWords.length > 0) {
            return 'Codeword already present'
        } else {
            return 'true'
        }



    }

    const addCodewordRow = (resolve, newData) => {
        var data = {
            id: props.match.params.id,
            codeword: newData.codeword,
        }
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        console.log(newData)
        var check = checkCodeword(newData.codeword)
        if (check === 'true') {
            API.post('dashboard/addcodeword', data, { headers: headers }).then(response => {
                console.log(response.data)
                if (response.data.code == 200) {
                    setSnack({
                        message: response.data.message,
                        open: true
                    })
                    const data = [...table.data];
                    data.push(newData);
                    setTable({ ...table, data });
                    console.log('render' + render)
                    setRender(!render)
                    resolve()
                } else {
                    setSnack({
                        message: response.data.message,
                        open: true
                    })
                    resolve()
                }
            })
        } else {
            setSnack({
                open: true,
                message: check
            })
            resolve()
        }
    }

    const updateCourseRow = (resolve, newData, oldData) => {
        var data = {
            id: props.match.params.id,
            newCodeword: newData.codeword,
            oldCodeword: oldData.codeword,
        }

        var check = checkCodeword(newData.codeword)
        if (check === 'true') {
            const headers = {
                'token': sessionStorage.getItem('token')
            };
            console.log(newData)
            API.post('dashboard/updatecodeword', data, { headers: headers }).then(response => {
                console.log(response.data)
                if (response.data.code == 200) {
                    setSnack({
                        message: response.data.message,
                        open: true
                    })
                    const data = [...table.data];
                    data[data.indexOf(oldData)] = newData;
                    setTable({ ...table, data });
                    setRender(!render)
                    resolve()
                } else {
                    setSnack({
                        message: response.data.message,
                        open: true
                    })
                    resolve()
                }
            })
        } else {
            setSnack({
                open: true,
                message: check
            })
            resolve()
        }
    }

    const deleteCodewordRow = (resolve, oldData) => {
        var data = {
            id: props.match.params.id,
            codeword: oldData.codeword
        }
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.post('dashboard/deletecodeword', data, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                setSnack({
                    message: response.data.message,
                    open: true
                })
                const data = [...table.data];
                data.splice(data.indexOf(oldData), 1);
                setTable({ ...table, data });
                setRender(!render)
                resolve();
            } else {
                setSnack({
                    message: response.data.message,
                    open: true
                })
                resolve()
            }
        })
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClickClose = value => {
        setOpen(false)
    };


    const handleFinalize = value => {

        const headers = {
            'token': sessionStorage.getItem('token')
        };
        console.log(props.match.params.id)
        API.post('dashboard/publishCodeworset', { id: props.match.params.id }, { headers: headers }).then(response => {

            if (response.data.code == 200) {
                setSnack({
                    open: true,
                    message: 'Codeword set finalized'
                })
                setDisableEdit(true)
            } else {
                setSnack({
                    open: true,
                    message: response.data.message
                })
            }
        })
    }

    const handleDeleteCodewordset = () => {

        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.post('dashboard/deleteCodewordset', { id: props.match.params.id }, { headers: headers }).then(response => {

            if (response.data.code == 200) {
                setSnack({
                    open: true,
                    message: response.data.message
                })
                setRedirect(true)
            } else {
                setSnack({
                    open: true,
                    message: response.data.message
                })
            }
        })
    }

    function SimpleDialog(props) {

        const { data, onClose, open, render } = props;

        const handleClose = (error) => {
            console.log('render   ' + render)
            setRender(!render)
            onClose();
        }

        function handleListItemClick(value) {
            onClose(value);
        }

        return (
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">Edit Codeword Set</DialogTitle>
                <EditCodewordSet data={data} onClose={handleClose}></EditCodewordSet>
            </Dialog>
        );
    }

    SimpleDialog.propTypes = {
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        render: PropTypes.bool.isRequired,
    };

    const handleReport = () => {
        // const headers = {
        //     'token': sessionStorage.getItem('token')
        // }; 
        // API.post('dashboard/generateReport', {id: props.match.params.id }, { headers: headers }).then(response => {
        //     console.log(response.data)       
        //     if(response.data.code == 200){
        //                 console.log(response.data.data)
        //             }
        // })
        setOpenReport(true)

    }

    const handleReportClose = () => {
        setOpenReport(false)
    }

    const handleDeleteConfirmation = () =>{
        setDeleteConfirmation(true)
    }
    const handleDeleteClose = () =>{
        setDeleteConfirmation(false)
        setRender(!render)
    }

    return (
        <div>
            <MyAppBar></MyAppBar>
        <div>
            
            {loading?<Grid container
            spacing={0}
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}>
            <CircularProgress className={classes.progress} />
        </Grid>
        :
            <Container component="main" maxWidth='lg'>
                <CssBaseline />
                <div className={classes.root}>

                    <Box className={classes.header} >
                        <Grid container >
                            <Grid item sm={6}>
                                <Grid container direction="column" >
                                    <Grid item>
                                        <Typography component="div">
                                            <Box fontSize="h6.fontSize" fontWeight="fontWeightBold" m={1}>
                                                {state.codewordSetName}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Grid container>


                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={1}>

                            </Grid>
                            <Grid item sm={5}>
                            <Box display="flex" flexDirection="row" justifyContent="flex-end">
                                {/* <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classes.report}
                                    onClick={handleReport}
                                    disabled={disableEdit}
                                >

                                    Report
                                </Button> */}
                                <Tooltip title="Report">
                                <IconButton 
                                    className={classes.iconButton} 
                                    onClick={handleReport}
                                    disabled={disableEdit}
                                    >
                                    <ListAltIcon fontSize="large"/>
                                </IconButton>
                                </Tooltip>

                                <Tooltip title="Finalize codeword set">
                                <IconButton 
                                    className={classes.iconButton} 
                                    onClick={handleFinalize}
                                    disabled={disableEdit}
                                    >
                                    <LockIcon fontSize="large"/>
                                </IconButton>
                                </Tooltip>
                                {/* <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classes.assign}
                                    onClick={handleFinalize}
                                    disabled={disableEdit}
                                >

                                    Finalize
                                </Button> */}
                                <Tooltip title="Edit codeword set">
                                <IconButton 
                                    className={classes.iconButton} 
                                    onClick={handleClickOpen}
                                    disabled={disableEdit}
                                    >
                                    <EditIcon fontSize="large"/>
                                </IconButton>
                                </Tooltip>
                                {/* <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classes.edit}
                                    onClick={handleClickOpen}
                                    disabled={disableEdit}
                                >
                                    edit
                                </Button> */}
                                <SimpleDialog data={state} open={open} onClose={handleClickClose} render={render} />
                                <Tooltip title="Delete codeword set">
                                <IconButton 
                                    className={classes.iconButtonDelete} 
                                    onClick={handleDeleteConfirmation}
                                    >
                                    <DeleteForeverIcon fontSize="large"/>
                                </IconButton>
                                </Tooltip>
                                
                                {/* <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classes.delete}
                                    onClick={handleDeleteConfirmation} >
                                    delete
                                </Button> */}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <div border={1} className={classes.course}>
                        <Grid container >
                            <Grid item sm={6} md={6} lg={6}>
                                <Grid container direction="column">
                                    <Grid item xs={12} >
                                        <Typography component="div">
                                            <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                Number of codewords: {state.count}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Typography component="div">
                                            <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                {state.isPublished}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>

                    </div>
                    <Grid container>
                        <Grid item sm={3}></Grid>
                        <Grid item >
                            <div className={classes.table}>
                                <MaterialTable
                                    icons={tableIcons}
                                    title="Codewords"
                                    columns={table.columns}
                                    data={table.data}
                                    options={{
                                        actionsColumnIndex: -1,
                                        headerStyle: {
                                            fontSize: 15
                                        },
                                        emptyRowsWhenPaging: false,
                                        exportButton: true,
                                        exportAllData: true
                                    }}
                                    editable={{
                                        onRowAdd: newData =>
                                            new Promise(resolve => {
                                                addCodewordRow(resolve, newData)

                                            }),
                                        onRowUpdate: (newData, oldData) =>
                                            new Promise(resolve => {
                                                updateCourseRow(resolve, newData, oldData)

                                            }),
                                        onRowDelete: oldData =>
                                            new Promise(resolve => {
                                                deleteCodewordRow(resolve, oldData)
                                            }),
                                    }}

                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={snack.open}
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

                <Dialog fullScreen={true} disableBackdropClick={true} onClose={handleReportClose} aria-labelledby="simple-dialog-title" open={openReport}>
                    <div className={classes.report}>
                        <Box p={2} display="flex" flexDirection="row" justifyContent="center">
                            <Typography variant="h6">
                                REPORT
                     </Typography>

                        </Box>
                        <Report id={props.match.params.id} handleClose={handleReportClose}></Report>
                    </div>
                </Dialog>

                <Dialog
                    open={deleteConfirmation}
                    onClose={handleDeleteClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Warning"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete this codeword set?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteClose} color="secondary">
                            NO
                         </Button>
                        <Button onClick={handleDeleteCodewordset} color="primary">
                            YES
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            }
        </div>
        </div>
    );

}
