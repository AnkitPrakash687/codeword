import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Appbar from '../MyAppBar'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import {
    Paper, Grid, Box, Button, Container, CssBaseline, Snackbar, Tooltip, Link,
    IconButton, CircularProgress, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText
} from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import API from '../../utils/API'
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Redirect } from "react-router-dom";
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import EditCourse from './EditCourse'
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import LockIcon from '@material-ui/icons/Lock';
import ListAltIcon from '@material-ui/icons/ListAlt';
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

        padding: theme.spacing(4)
    },
    assign: {
        margin: theme.spacing(1),
        background: green[500],
        "&:hover": {
            backgroundColor: "green"
        }
    },
    edit: {
        margin: theme.spacing(1)
    },
    delete: {
        margin: theme.spacing(1),
        background: red[700],
        "&:hover": {
            backgroundColor: red[600]
        }
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

    },
    iconButton: {
        background: grey[300],
        margin: theme.spacing(1),
        color: grey[900]
    },
    iconButtonDelete: {
        background: grey[300],
        margin: theme.spacing(1),
        color: red[900]
    }
}));
export default function Course(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        id: props.match.params.id,
        courseName: '',
        startDate: '',
        endDate: '',
        startSurvey: '',
        endSurvey: '',
        isAssigned: '',
        codewordset: '',
        codewordCount: 0,
        ack: ''
    })

    const [snack, setSnack] = useState({
        message: '',
        open: false
    })
    const [table, setTable] = useState({
        columns: [
            { title: 'Name', field: 'name' },
            { title: 'Email', field: 'email' },
            { title: 'Registered', field: 'register' }
        ],
        data: [],
    })
    const [open, setOpen] = useState(false)
    const [render, setRender] = useState(false)
    const [disableEdit, setDisableEdit] = useState(false)
    const [cannotAssignError, setCannotAssignError] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.get('dashboard/getcourse/' + state.id, { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);

            if (response.status == 200) {
                console.log(response.data)
                var course = response.data.data
                var studentList = course.students.map((student) => {
                    return { name: student.name, email: student.email }
                })

                setTable({
                    columns: [
                        { title: 'Name', field: 'name' },
                        { title: 'Email', field: 'email' },
                        { title: 'Registered', field: 'register' }
                    ],
                    data: studentList
                })
                var ack = course.students.reduce((acc, item) => {
                    if (item.isRevealed) {
                        return acc + 1
                    } else {
                        return acc + 0
                    }
                }, 0)
                setState({
                    id: course._id,
                    courseName: course.courseNameKey,
                    startDate: (course.Startdate.toString()).substring(0, 10),
                    endDate: (course.Enddate.toString()).substring(0, 10),
                    startSurvey: course.PreSurveyURL == '' ? 'Unpublished' : course.PreSurveyURL,
                    endSurvey: course.PostSurveyURL == '' ? 'Unpublished' : course.PostSurveyURL,
                    isAssigned: course.isAssigned,
                    codewordCount: (course.codewordSet.codewords && course.codewordSet.codewords.length > 0 ) ? 
                                    course.codewordSet.codewords.length : 0,
                    codewordset: (!course.codewordSet.codewordSetName || course.codewordSet.codewordSetName == '')
                        ? 'Not Assigned' : course.codewordSet.codewordSetName,
                    ack: ack + '/' + course.students.length
                })

                
                if (course.isAssigned) {
                    setDisableEdit(true)
                }

                setLoading(false)
            }
        })
            .catch(error => {
                console.log(error)
            })
    }, [render])


    useEffect(()=>{
        var data = {
            studentEmails: table.data.map((item)=>{ return item.email})
        }
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.post('dashboard/checkUsers/' , data, { headers: headers }).then(response => {

        })
    }, [table])
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

    const handleDeleteClose = value => {
        setDeleteConfirmation(false)
    }
    const addCourseRow = (resolve, newData) => {

        if(state.codewordCount < table.data.length){
            setSnack({
                message: 'Select larger codeword set',
                open: true
            })
            resolve()
        }else{
        var data = {
            id: state.id,
            email: newData.email,
            name: newData.name
        }
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        console.log(newData)
        API.post('dashboard/addstudent', data, { headers: headers }).then(response => {
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
               // setRender(!render)
                resolve()
            } else {
                setSnack({
                    message: response.data.message,
                    open: true
                })
                resolve()
            }
        })
    }
}

    const updateCourseRow = (resolve, newData, oldData) => {
        var data = {
            id: state.id,
            newEmail: newData.email,
            newName: newData.name,
            oldEmail: oldData.email,
            oldName: oldData.name
        }
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        console.log(newData)
        API.post('dashboard/editstudent', data, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                setSnack({
                    message: response.data.message,
                    open: true
                })
                const data = [...table.data];
                data[data.indexOf(oldData)] = newData;
                setTable({ ...table, data });
                //setRender(!render)
                resolve()
            } else {
                setSnack({
                    message: response.data.message,
                    open: true
                })
                resolve()
            }
        })
    
    }

    const deleteCourseRow = (resolve, oldData) => {
        var data = {
            id: state.id,
            email: oldData.email
        }
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.post('dashboard/deletestudent', data, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                setSnack({
                    message: response.data.message,
                    open: true
                })
                const data = [...table.data];
                data.splice(data.indexOf(oldData), 1);
                setTable({ ...table, data });
               // setRender(!render)
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

    const handleDeleteConfirmation = value => {
        console.log(state.codewordSet)
        setDeleteConfirmation(true)
    }
    const handleAssign = value => {
        console.log(state.codewordset)
        if (state.codewordset == 'Not Assigned' || state.codewordset == '' || !state.codewordset) {
            setCannotAssignError(true)
        } else {
            var studentEmails = table.data.map((item) => {
                return item.email
            })
            const headers = {
                'token': sessionStorage.getItem('token')
            };
            API.post('dashboard/assignCourse', { id: props.match.params.id, studentEmails: studentEmails }, { headers: headers }).then(response => {

                if (response.data.code == 200) {
                    setSnack({
                        open: true,
                        message: 'Course Assigned'
                    })
                    setDisableEdit(true)
                    setRender(!render)
                } else {
                    setSnack({
                        open: true,
                        message: response.data.message
                    })
                }
            })
        }
    }

    const handleAssignErrorClose = () => {
        setCannotAssignError(false)
    }
    const handleDeleteCourse = value => {
        var studentEmails = table.data.map((item) => {
            return item.email
        })
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.post('dashboard/deleteCourse', { id: props.match.params.id, studentEmails: studentEmails }, { headers: headers }).then(response => {

            if (response.data.code == 200) {
                setSnack({
                    open: true,
                    message: 'Course Deleted'
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
                <DialogTitle id="simple-dialog-title">Edit Course</DialogTitle>
                <EditCourse data={data} onClose={handleClose}></EditCourse>
            </Dialog>
        );
    }

    SimpleDialog.propTypes = {
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        render: PropTypes.bool.isRequired,
    };

    return (
        <div>
         
            <MyAppBar/>
            {loading ? <Grid container
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
                                                    {state.courseName}
                                                </Box>
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Grid container>
                                                <Grid item>
                                                    <Typography variant="caption" className={classes.title}>
                                                        Start Date: {state.startDate}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="caption" className={classes.title}>
                                                        End date: {state.endDate}
                                                    </Typography>
                                                </Grid>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item sm={3}>

                                </Grid>
                                <Grid item sm={3}>

                                    {/* <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classes.assign}
                                    onClick={handleAssign}
                                    disabled={disableEdit}
                                    >
                                    
                                    assign
                                </Button> */}
                                    <Tooltip title="Assign Course">
                                        <IconButton
                                            className={classes.iconButton}
                                            onClick={handleAssign}
                                            disabled={disableEdit}
                                        >
                                            <LockIcon fontSize="large" />
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
                                    <Tooltip title="Edit course">
                                        <IconButton
                                            className={classes.iconButton}
                                            onClick={handleClickOpen}
                                        // disabled={disableEdit}
                                        >
                                            <EditIcon fontSize="large" />
                                        </IconButton>
                                    </Tooltip>
                                    <SimpleDialog data={state} open={open} onClose={handleClickClose} render={render} />

                                    {/* <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classes.delete}
                                    onClick = {handleDeleteCourse} >
                                    delete
                                </Button> */}

                                    <Tooltip title="Delete course">
                                        <IconButton
                                            className={classes.iconButtonDelete}
                                            onClick={handleDeleteConfirmation}
                                        >
                                            <DeleteForeverIcon fontSize="large" />
                                        </IconButton>
                                    </Tooltip>
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
                                                    Acknowledged: {state.ack}
                                                </Box>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Typography component="div">
                                                <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                    Codeword Set: {state.codewordset}
                                                </Box>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item sm={6} md={6} lg={6}>
                                    <Grid container direction="column">
                                        <Grid item xs={12} >

                                            {state.startSurvey != 'Unpublished' &&
                                                <Link onClick={event => event.stopPropagation()} target="_blank" href={state.startSurvey} variant="body2" className={classes.link}>
                                                    <Typography component="div">
                                                        <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                            Start Survey
                                            </Box>
                                                    </Typography>
                                                </Link>}
                                        </Grid>
                                        <Grid item xs={12}>
                                            {state.endSurvey != 'Unpublished' &&
                                                <Link onClick={event => event.stopPropagation()} target="_blank" href={state.endSurvey} variant="body2" className={classes.link}>
                                                    <Typography component="div">
                                                        <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                            End Survey
                                            </Box>
                                                    </Typography>
                                                </Link>}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </div>
                        <div className={classes.table}>
                            <MaterialTable
                                icons={tableIcons}
                                title="Students"
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
                                editable={{ onRowAdd: !disableEdit ? newData =>
                                        new Promise(resolve => {
                                            addCourseRow(resolve, newData)

                                        }):null,
                                    onRowUpdate: !disableEdit ? (newData, oldData) =>
                                        new Promise(resolve => {
                                            updateCourseRow(resolve, newData, oldData)

                                        }):null,
                                    onRowDelete: !disableEdit ? oldData =>
                                        new Promise(resolve => {
                                            deleteCourseRow(resolve, oldData)
                                        }):null,

                                }}
                            />
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
                    </div>
                    <Dialog
                        open={cannotAssignError}
                        onClose={handleAssignErrorClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">{"Error"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                You cannot assign course untill you set the codeword set.
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleAssignErrorClose} color="secondary">
                                OK
                         </Button>
                        </DialogActions>
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
                            <Button onClick={handleDeleteCourse} color="primary">
                                YES
                        </Button>
                        </DialogActions>
                    </Dialog>



                </Container>
            }
        </div>
    );

}
