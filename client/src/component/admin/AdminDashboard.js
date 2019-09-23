import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, grey, red } from '@material-ui/core/colors';
import { Paper, Grid, CircularProgress, Container, CssBaseline, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button'
import API from '../../utils/API'
import ContainedTabs from '../mui-treasury/ContainedTabs'
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
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
import AddCodewordSet from '../codewordset/AddCodewordSet'
import CodewordsetCard from '../codewordset/CodewordsetCard'
import MyAppBar from '../MyAppBar'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
const moment = require('moment')
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
        margin: 30,
        flexGrow: 1,
        backgroundColor: theme.palette.white,
    },
    menuBar: {
        minHeight: 60,
        background: green[500]
    },
    appBar: {
        background: green[600]
    },
    paper: {
        minHeight: 500,
        padding: 20,
        background: lightGreen[200]
    },
    paper2: {
        padding: 20,
        margin: 20,
        background: lightGreen[200]
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
    button: {
        margin: theme.spacing(2),
        textTransform: "none",
        color: grey[300]

    }
}));

export default function AdminDashboard() {

    const CheckIconGreen = withStyles(theme => ({
        root: {
            color: green[500]
        },
      }))(CheckCircleIcon);

      const CancelIconRed = withStyles(theme => ({
        root: {
            color: red[500]
        },
      }))(CancelIcon);
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
                    }} minHeight={450} p={3}>{children}</Box>
            </Typography>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    const [value, setValue] = useState(0);
    const [snack, setSnack] = useState({
        status: false,
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [instructorRequest, setInstructorRequest] = useState();
    const [table, setTable] = useState({
        columns: [
            { title: 'id', field: 'id', hidden:true, export:false},
            { title: 'Name', field: 'name', cellStyle: {width: 100} },
            { title: 'Email', field: 'email', cellStyle: {width: 100} }
        ],
        data: [],
    })

    const [tableUsers, setTableUsers] = useState({
        columns: [
            { title: 'id', field: 'id', hidden:true, export:false},
            { title: 'Name', field: 'name', cellStyle: {width: 100} },
            { title: 'Email', field: 'email', cellStyle: {width: 100} },
            { title: 'Role', field: 'role', cellStyle: {width: 100}},
            { title: 'Status', field: 'status', cellStyle: {width: 100},
              render: rowData => {
                    if(rowData.status){
                        return <Typography component="div">
                            <Box color="green" fontWeight="bold">
                                Active
                            </Box>
                        </Typography>
                    }
                    else{
                        return (<Typography component="div">
                        <Box color="red" fontWeight="bold">
                            Inactive
                        </Box>
                    </Typography>)
                    }
              }  
            }

        ],
        data: [],
    })
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }


    const handleMessageClose = value => {
        setSnack({ status: false })
    };



    const [courseData, setCourseData] = useState([{}])
    const [render, setRender] = useState(false)
    const [openCodeword, setOpenCodeword] = useState()
  
    const handleCodewordClickOpen = () =>{
        setOpenCodeword(true)
    }

    const handleCodewordClose = () => {
        setOpenCodeword(false)
    }
    useEffect(() => {

        if(value == 0){
        setLoading(true)
        console.log('inside effect')
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        API.get('dashboard/requests', { headers: headers }).then(response => {
            console.log("me***********")
            var data = response.data.data
            console.log(data)
            
            setTable({
                ...table,
                data: data.map((user)=>{
                    return {id: user.id, name: user.name, email: user.email}
                })
            })
            setLoading(false)

        })
        .catch(error => {
                        console.log(error)

                    })
    }
    else if(value == 1){
        setLoading(true)
        console.log('inside effect')
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        API.get('dashboard/getAllUsers', { headers: headers }).then(response => {
            console.log("me***********")
            var data = response.data.data
            console.log(data)
            console.log('*********MOMENT***************')
           // var date = moment(data[1].last_login)
           // console.log(date)
           // console.log( moment(moment() - moment(data[1].last_login)).format('D'))
            setTableUsers({
                ...tableUsers,
                data: data.map((user)=>{
                    return {
                        id: user._id, 
                        name: user.first_name + ' '+user.last_name, 
                        email: user.email_id,
                        role: user.role,
                        status: moment().diff(moment(user.last_login), 'days') < 365 ? true: false
                    }
                })
              
            })
           
            setLoading(false)

        })
        .catch(error => {
                        console.log(error)

                    })
    }  

    }, [render, value])

    useEffect(() => {

        console.log('inside effect')
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.get('dashboard/getcodewordset', { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);
            let data = response.data.data
            let result = []
            console.log('********* Codeword Set admin')
            console.log(data)
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

    }, [])

    const handleAcceptRequest = (resolve, rowData) => {
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        API.post('dashboard/acceptRequest', {id: rowData.id}, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == '200') {
                setSnack({
                    status: true,
                    message: 'Request accepted!'
                })
                const data = [...table.data];
                data.splice(data.indexOf(rowData), 1);
                setTable({ ...table, data });
                //setRender(!render)
                resolve();
            }
        })
    }

    const deleteUserRow = (resolve, oldData) => {
        var data = {
            id: oldData.id,
        }
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.post('dashboard/deleteUser', data, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                setSnack({
                    message: response.data.message,
                    open: true
                })
                const data = [...tableUsers.data];
                data.splice(data.indexOf(oldData), 1);
                setTableUsers({ ...tableUsers, data });
                //setRender(!render)
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
    const handleDeclineRequest = (resolve, rowData) => {
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        API.post('dashboard/declineRequest', {id: rowData.id}, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == '200') {
                setSnack({
                    status: true,
                    message: 'Request declined!'
                })
                const data = [...table.data];
                data.splice(data.indexOf(rowData), 1);
                setTable({ ...table, data });
                //setRender(!render)
                resolve();
            }
        })
    }
    const [codewordsetData, setCodewordsetData] = useState([])
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
            <MyAppBar></MyAppBar>
        <div className={classes.root}>
            
                <Container component="main" maxWidth='lg'>
                    <CssBaseline />
                   
                    <ContainedTabs
                        style={{ alignSelf: 'flex-center', }}
                        tabs={[
                            { label: 'Requests' },
                            { label: 'Manage Users' },
                            { label: 'Codeword Set' }
                        ]}
                        value={value}
                        onChange={handleChange}
                    >
                    </ContainedTabs>
             

                    <TabPanel value={value} index={0}>


                   { loading ? <Grid container
                spacing={0}
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}>
                <CircularProgress className={classes.progress} />
            </Grid>:
                    <Grid container>
                        <Grid item sm={3}></Grid>
                        <Grid item xs={12} sm={5}>
                        <MaterialTable
                            icons={tableIcons}
                            title="Requests"
                            columns={table.columns}
                            data={table.data}
                            options={{
                                actionsColumnIndex: 0,
                                headerStyle: {
                                    fontSize: 15
                                },
                                emptyRowsWhenPaging: false,
                                exportButton: true,
                                exportAllData: true
                            }}
                            actions={[
                                {
                                    icon: CheckIconGreen,
                                    tooltip: 'Accept',
                                    onClick: (event, rowData) =>
                                        new Promise(resolve =>{
                                            handleAcceptRequest(resolve, rowData)
                                        })
                                    
                                },
                                {
                                    icon: CancelIconRed,
                                    tooltip: 'Decline',
                                    onClick: (event, rowData) =>
                                        new Promise(resolve =>{
                                            handleDeclineRequest(resolve, rowData)  
                                        })
                                    
                                }
                            ]}
                               
                        />
                        </Grid>
                        <Grid item sm={3}></Grid>
                        </Grid>
                   }
                    </TabPanel>
                    <TabPanel value={value} index={1}>

                  {  loading ? <Grid container
                spacing={0}
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}>
                <CircularProgress className={classes.progress} />
            </Grid>:

                    <Grid container>
                        <Grid item sm={2}></Grid>
                        <Grid item xs={12} sm={8}>
                        <MaterialTable
                            icons={tableIcons}
                            title="Users"
                            columns={tableUsers.columns}
                            data={tableUsers.data}
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
                                isDeletable: rowData => !rowData.status,
                                onRowDelete: oldData => 
                                    new Promise(resolve => {
                                        deleteUserRow(resolve, oldData)
                                    }),
                            }}
                               
                        />
                        </Grid>
                        <Grid item sm={2}></Grid>
                        </Grid>
                  }
                    </TabPanel>
                    <TabPanel value={value} index={2}>

                           
            <Button variant="contained" color="primary" className={classes.button} onClick={handleCodewordClickOpen}>
                    Add codeword Set
            </Button>
           
            <Dialog  fullWidth={true} disableBackdropClick={true} onClose={handleCodewordClose} aria-labelledby="simple-dialog-title" open={openCodeword}>    
                 <div>
                 <DialogTitle id="simple-dialog-title">Add Codeword Set</DialogTitle>
                <AddCodewordSet onClose={handleCodewordClose}></AddCodewordSet>
                </div>         
            </Dialog>
            {loading ? <Grid container
                spacing={0}
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}>
                <CircularProgress className={classes.progress} />
            </Grid>:
               <Grid container spacing={3}>

                    {
                        listCodewordSet.length > 0 &&
                        listCodewordSet
                    }

                </Grid>
            }
                    </TabPanel>

                </Container>
            

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snack.status}
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

    );

}
