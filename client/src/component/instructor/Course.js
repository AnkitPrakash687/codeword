import {
    Box, Button, CircularProgress, Container, CssBaseline, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Link, Snackbar,
    Tooltip, Fab, TextField, Slide
} from '@material-ui/core';
import { green, grey, lightGreen, red, amber } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddBox from '@material-ui/icons/AddBox';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import { default as Edit, default as EditIcon } from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import LockIcon from '@material-ui/icons/Lock';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import history from '../../history';
import API from '../../utils/API';
import MyAppBar from '../MyAppBar';
import EditCourse from './EditCourse';

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
        padding: theme.spacing(1)
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
        margin: theme.spacing(2, 0, 0, 2),
        color: grey[800],
        "&:hover": {
            backgroundColor: grey[400]
        }
    },
    iconButtonDelete: {
        background: grey[300],
        margin: theme.spacing(2, 2, 2, 2),
        "&:hover": {
            backgroundColor: grey[400]
        },
        color: red[800]
    },
    form: {
        width: '100%',
        padding: theme.spacing(2),

    },
    textField: {
        margin: theme.spacing(1)
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
    const [error, setError] = useState({
        status: false,
        message: ''
    })
    const [finalizeConfirmation, setFinalizeConfirmation] = useState(false)
    const [table, setTable] = useState({
        columns: [
            { title: 'Name', field: 'name' },
            { title: 'Email', field: 'email' },
            {
                title: 'Registered', field: 'registered', editable: 'never',
                render: rowData => {
                    if (rowData && rowData.registered) {
                        return <Typography component="div">
                            <Box color="green" fontWeight="bold">
                                Yes
                        </Box>
                        </Typography>
                    }
                    else {
                        return (<Typography component="div">
                            <Box color="red" fontWeight="bold">
                                No
                    </Box>
                        </Typography>)
                    }
                }
            }

        ],
        data: []
        
    })
    const [isLoading, setIsLoading] = useState(false)
    const [pageSize, setPageSize] = useState(0)
    const [open, setOpen] = useState(false)
    const [render, setRender] = useState(false)
    const [disableEdit, setDisableEdit] = useState()
    const [cannotAssignError, setCannotAssignError] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState()
    const [loading, setLoading] = useState(false)
    const [newStudent, setNewStudent] = useState({
        name: '',
        email: ''
    })
    const handleFinalizeClose = () =>{
        setFinalizeConfirmation(false)
    }
    const [addStudent, setAddStudent] = useState({
        open: false
    })
    const [autoFocus, setAutoFocus] = useState()
    //const [users, setUsers] = useState()
    useEffect(() => {

        setPageSize(sessionStorage.getItem('pageSizeCourse', 5))
       // setLoading(true)
       setIsLoading(true)
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        var users = []
        API.get('dashboard/checkUsers', { headers: headers }).then(response => {
            if (response.data.code == 200) {

                users = response.data.data
                return true
            }
        }).then(response => {
            API.get('dashboard/getcourse/' + state.id, { headers: headers }).then(response => {
                console.log('?? Returned data in :', response);

                if (response.status == 200) {
                    console.log(response.data)
                    var course = response.data.data
                    var studentList = course.students.map((student) => {

                        return { name: student.name, email: student.email, registered: users.includes(student.email) }
                    })

                    setTable({
                        ...table,
                        data: studentList
                    })
                    var ack = course.students.reduce((acc, item) => {
                        if (item.isRevealed) {
                            return acc + 1
                        } else {
                            return acc + 0
                        }
                    }, 0)

                    console.log('START DATE,,,',course.Startdate)
                    setState({
                        id: course._id,
                        courseName: course.courseNameKey,
                        startDate: (course.Startdate.toString()),
                        endDate: (course.Enddate.toString()),
                        startSurvey: !course.PreSurveyURL  ? '' : course.PreSurveyURL,
                        endSurvey: !course.PostSurveyURL ? '' : course.PostSurveyURL,
                        isAssigned: course.isAssigned,
                        codewordCount: (course.codewordSet.codewords && course.codewordSet.codewords.length > 0) ?
                            course.codewordSet.codewords.length : 0,
                        codewordset: (!course.codewordSet.codewordSetName || course.codewordSet.codewordSetName == '')
                            ? 'Not Assigned' : course.codewordSet.codewordSetName,
                        ack: ack + '/' + course.students.length
                    })


                    if (course.isAssigned) {
                        setDisableEdit(true)
                    }

                  //  setLoading(false)
                  setIsLoading(false)
                }
            })
        }).catch(error => {
            console.log(error)
        })

    }, [render])

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
    useEffect(() => {
        window.scrollTo(0, 0)
        sessionStorage.setItem('pageSizeCourse', 5)

    }, [])
    const [redirect, setRedirect] = useState(false);
    const handleCardClick = () => {
        console.log('click working')
        setRedirect(true)

    }
    if (redirect) {
        history.push('/', { value: 0 })
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

    const handleDialogClose = name => () => {
        if (name == 'addStudent') {
            setAddStudent({
                open: false
            })
        }
    }


    const handleChange = name => (event) => {
        console.log({ [name]: event.target.value })
        setNewStudent({ ...newStudent, [name]: event.target.value });
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (name == 'email') {
            if (!emailRegex.test(event.target.value)) {
                setError({
                    status: true,
                    message: 'Invalid Email'
                })
            }else{
                setError({
                    status: false,
                    message: ''
                })
            }
        }

    }

    const addCourseRow = (resolve, newData) => {

        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!emailRegex.test(newData.email)) {
            resolve()
            setSnack({
                message: 'Invalid Email',
                open: true
            })
        } else {
            var data = {
                id: state.id,
                email: newData.email,
                name: newData.name
            }
            const headers = {
                'token': sessionStorage.getItem('token')
            };
            // console.log(newData)
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
                    // console.log('render' + render)
                 //   setRender(!render)
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

    const addCourseRowNew = (event) => {
        event.preventDefault()
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!emailRegex.test(newStudent.email)) {
            // setSnack({
            //     message: 'Invalid Email',
            //     open: true,
            //     error: true
            // })
        } else {
            var data = {
                id: state.id,
                email: newStudent.email,
                name: newStudent.name
            }
            const headers = {
                'token': sessionStorage.getItem('token')
            };
            // console.log(newData)
            API.post('dashboard/addstudent', data, { headers: headers }).then(response => {
                console.log(response.data)
                if (response.data.code == 200) {
                    setSnack({
                        message: response.data.message,
                        open: true
                    })
                    const data = [...table.data];
                    data.push(data);
                    setTable({ ...table, data });
                    // console.log('render' + render)
                    setNewStudent({
                        name:'',
                        email: ''
                    })
                    setRender(!render)
                    // resolve()
                } else {

                    setError({
                        status:true,
                        message: response.data.message
                    })
                    setSnack({
                        message: response.data.message,
                        open: true
                    })
                    //  resolve()
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

    const handleClickEdit = (rowData) => {

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
    const handleAssign = (event) => {
        event.preventDefault()
        console.log(state.codewordset)


        if (state.codewordset == 'Not Assigned' || state.codewordset == '' || !state.codewordset) {
            setCannotAssignError(true)
        } else if (state.codewordCount < table.data.length) {
            setSnack({
                message: 'Select larger codeword set',
                open: true
            })

        }
        else {
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
                    setFinalizeConfirmation(false)
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
        setFinalizeConfirmation(false)
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
            // console.log('render   ' + render)
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

    const handleBackButton = () => {
        setRedirect(true)
    }

    return (
        <div>

            <MyAppBar backButton={true} from="course" />
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
                                        <Box display="flex" flexDirection="row" justifyContent="flex-start">
                                            {/* <Box p={1}>
                                                <Tooltip title="Back to dasboard">
                                                    <IconButton
                                                        className={classes.backButton}
                                                        onClick={handleBackButton}

                                                    >
                                                        <ArrowBackIosIcon fontSize="large" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box> */}
                                            <Box p={2} display="flex" flexDirection="column" justifyContent="flex-start">
                                                <Box >
                                                    <Typography component="div">
                                                        <Box fontSize="h6.fontSize" fontWeight="fontWeightBold">
                                                            {state.courseName}
                                                        </Box>
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" flexDirection="row" justifyContent="flex-start">

                                                    <Typography variant="caption" style={{ marginRight: 15 }}>
                                                        Start Date: {state.startDate.toString().substring(0,10)}
                                                    </Typography>

                                                    <Typography variant="caption">
                                                        End date: {state.endDate.toString().substring(0,10)}
                                                    </Typography>

                                                </Box>
                                            </Box>

                                        </Box>


                                    </Grid>
                                </Grid>
                                <Grid item sm={6}>
                                    <Box display="flex" flexDirection="row" justifyContent="flex-end">



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
                                        <Tooltip title="Finalize Course">
                                            <Fab
                                                variant="extended"
                                                className={classes.iconButton}
                                                onClick={()=>{setFinalizeConfirmation(true)}}
                                                disabled={disableEdit}
                                            >
                                                <LockIcon style={{ color: grey[800] }} />
                                                Finalize
                                        </Fab>
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
                                            <Fab
                                                variant="extended"
                                                className={classes.iconButton}
                                                onClick={handleClickOpen}
                                            // disabled={disableEdit}
                                            >
                                                <EditIcon style={{ color: grey[800] }} />
                                                <Typography variant="body2" style={{ fontWeight: 500 }}>Edit</Typography>
                                            </Fab>
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
                                            <Fab
                                                variant="extended"
                                                className={classes.iconButtonDelete}
                                                onClick={handleDeleteConfirmation}
                                            >
                                                <DeleteForeverIcon style={{ color: red[800] }} />
                                                <Typography variant="body2" style={{ fontWeight: 700 }}>Delete</Typography>
                                            </Fab>
                                        </Tooltip>


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
                                        <Grid item xs={12} sm={12} md={12} lg={12} >


                                            <div>
                                                <Typography component="div">
                                                    <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                        Start Survey Link: &nbsp;
                                                            {(state.startSurvey != '' ) ?
                                                            <Link onClick={event => event.stopPropagation()} target="_blank" href={state.startSurvey} variant="body2" className={classes.link}>
                                                                Click here
                                                            </Link> : 'N/A'}
                                                    </Box>
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12}>

                                            <div>
                                                <Typography component="div">
                                                    <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                        End Survey Link: &nbsp;
                                                        {(state.endSurvey != '') ?
                                                            <Link onClick={event => event.stopPropagation()} target="_blank" href={state.endSurvey} variant="body2" className={classes.link}>
                                                                Click here
                                                        </Link> : 'N/A'}
                                                    </Box>
                                                </Typography>

                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </div>
                        <Box display="flex" justifyContent="center">
                            <Grid className={classes.table} xs={12} sm={8}>
                                <MaterialTable
                                    icons={tableIcons}
                                    isLoading={isLoading}
                                    pageSizeOptions={table.pageSizeOptions}
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
                                        exportAllData: true,
                                        pageSizeOptions:[5,10,20,50],
                                        pageSize: pageSize == 0?5:pageSize
                                    }}
                                    editable={{
                                        // onRowAdd: !disableEdit ? newData =>
                                        //     new Promise(resolve => {
                                        //         addCourseRow(resolve, newData)

                                        //     }) : null,
                                        onRowUpdate: !disableEdit ? (newData, oldData) =>
                                            new Promise(resolve => {
                                                updateCourseRow(resolve, newData, oldData)

                                            }) : null,
                                        onRowDelete: !disableEdit ? oldData =>
                                            new Promise(resolve => {
                                                deleteCourseRow(resolve, oldData)
                                            }) : null,

                                    }}
                                    actions={!disableEdit ?[

                                        {
                                            icon: AddBox,
                                            isFreeAction: true,
                                            onClick: () => {
                                                // open dialog to save new one
                                                setAddStudent({
                                                    open: true
                                                })

                                            }
                                        }
                                    ]:null}

                                    onChangeRowsPerPage={(pageSize) =>{
                                        console.log('*******PageSize***********')
                                        setPageSize(pageSize)
                                        sessionStorage.setItem('pageSizeCourse', pageSize)
                                    }}
                                />
                                <Snackbar
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    TransitionComponent={Slide}
                                    TransitionProps={
                                        { direction: "right" }
                                    }
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

                            </Grid>
                        </Box>
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

                    <Dialog
                            open={finalizeConfirmation}
                            onClose={handleFinalizeClose}
                            aria-labelledby="alert-dialog-slide-title"
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle id="alert-dialog-slide-title">{"Warning"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    Are you sure you want to finalize this codeword set?
                        </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleFinalizeClose} color="secondary">
                                    NO
                         </Button>
                                <Button onClick={handleAssign} color="primary">
                                    YES
                        </Button>
                            </DialogActions>
                        </Dialog>

                    <Dialog
                        open={addStudent.open}
                        onClose={handleDialogClose('addStudent')}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Add Student"}</DialogTitle>

                        <form onSubmit={addCourseRowNew} className={classes.form} >

                            <TextField
                                className={classes.textField}

                                required
                                variant="outlined"
                                margin="normal"
                                margin="dense"
                                name="newStudentName"
                                label="Student Name"
                                type="text"
                                id="newStudentName"
                                value={newStudent.name}
                                onChange={handleChange('name')}
                            />

                            <TextField
                                className={classes.textField}
                                error={error.status}
                                helperText={error.message}
                                required
                                variant="outlined"
                                margin="normal"
                                margin="dense"
                                name="newStudentEmail"
                                label="Student Email"
                                type="text"
                                id="newStudentEmail"
                                value={newStudent.email}
                                onChange={handleChange('email')}
                            />




                            <DialogActions>
                                <Button onClick={handleDialogClose('addStudent')} color="secondary">
                                    Cancel
                            </Button>
                                <Button 
                                disabled={error.status}
                                type="submit" 
                                color="primary" 
                                autoFocus>
                                    Add
                            </Button>
                            </DialogActions>
                        </form>
                    </Dialog>



                </Container>
            }
        </div>
    );

}
