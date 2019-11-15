import { Box, CircularProgress, Container, CssBaseline, FormControl, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Select, Typography } from '@material-ui/core';
import { green, grey, lightGreen, red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import React, { useEffect, useState } from 'react';
import API from '../../utils/API';
import ReportCard from './ReportCard';
const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 20,
        flexGrow: 1,
        //  background: theme.palette.background.paper,
        background: lightGreen[200],
        minHeight: 500

    },
    report: {
        background: green[600],
    },
    paper: {
        borderRadius: 5,
        background: lightGreen[200],
        padding: theme.spacing(2),
    },

    heading: {
        borderRadius: 5,
        margin: theme.spacing(2, 0, 0, 0),
        background: green[300],

    },
    content: {
        padding: theme.spacing(5),
        background: grey[200]
    },
    progress: {
        margin: theme.spacing(2),
    },
    formControl: {
        minWidth: 250
    },
    cancelButton: {
        margin: theme.spacing(1),
        color: red[900]
    }

}));

export default function Report(props) {
    const classes = useStyles();
    const [render, setRender] = useState(false);
    const [similarCodewords, setSimilarCodewords] = useState([]);
    const [anagrams, setAnagrams] = useState([])
    const [loading, setLoading] = useState()
    const [level, setLevel] = useState(1)

    const inputLabel = React.useRef(null);
    const [disableUpdate, setDisableUpdate] = useState('true')
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    useEffect(() => {
        setLoading(true)
        console.log('report')
        console.log(props.id)
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        API.post('dashboard/generateReport', { id: props.id, level: level }, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                console.log(response.data.data)
                setSimilarCodewords(response.data.data.similars)
                setAnagrams(response.data.data.anagrams)
                setLoading(false)
            }
        })
    }, [render])

    const handleClose = () => {
        props.handleClose()
    }
    const handleRender = () => {
        setRender(!render)
    }
    const listCodeword =
        similarCodewords.map((item) => {
            return <ReportCard id={props.id} items={item} render={handleRender}></ReportCard>
        })
    // const handleClick = () =>{
    //     setRender(!render)
    //     console.log(render)
    // }
    const listAnagrams =
        anagrams.map((item) => {
            return <ReportCard id={props.id} items={item} render={handleRender}></ReportCard>
        })


    const handleChange = (event) => {
        console.log(event.target)
        setLevel(event.target.value);
        setRender(!render)
    }
    return (
        <div>

            <Container component="main" >
                <CssBaseline />


                <div>
                    <Paper className={classes.report}>
                        <Grid container>
                            <Grid item sm={6}>

                                <Box display="flex" p={2}>
                                    <Typography component="div">

                                        <Box fontSize="h6.fontSize" m={1}>
                                            Report
                                        </Box>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Box display="flex" justifyContent="flex-end">


                                    <IconButton
                                        color="primary"
                                        className={classes.cancelButton}
                                        aria-label="cancel"
                                        component="span"
                                        onClick={handleClose}
                                    >
                                        <CancelRoundedIcon fontSize="large" />
                                    </IconButton>

                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper className={classes.content}>

                        <Box display="flex" flexDirection="row" className={classes.heading}>
                            <Box p={1} width="100%" justifyContent="flex-start">
                                <Typography component="div">
                                    <Box fontSize="h6.fontSize" m={1}>
                                        Similar Codewords
                                        </Box>
                                </Typography>
                            </Box>


                        </Box>

                        <Paper className={classes.paper}>
                        
                            <FormControl margin='dense' variant="outlined" className={classes.formControl}>
                                <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                                    Select Level of similarity
                        </InputLabel>
                                <Select
                                    value={level}
                                    onChange={handleChange}
                                    input={<OutlinedInput labelWidth={labelWidth} name="level" id="outlined-age-simple" />}
                                >
                                 

                                    {/* <MenuItem value={0}>Level 1 - Lowest</MenuItem> */}
                                    <MenuItem value={0}>Low</MenuItem>
                                    <MenuItem value={1}>Medium</MenuItem>
                                    {/* <MenuItem value={3}>Level 3 - High</MenuItem> */}
                                    <MenuItem value={2}>High</MenuItem>

                                </Select>
                            </FormControl>
                        
                            <Grid container >
                                {

                                    loading ?
                                        <Grid container
                                            spacing={0}
                                            alignItems="center"
                                            justify="center"
                                            >
                                            <CircularProgress className={classes.progress} />
                                        </Grid> : false
                                }
                                {listCodeword.length > 0 ?
                                    listCodeword
                                    : !loading?
                                    <Grid container>
                                        <Box p={1} width="100%" display="flex" justifyContent="center">
                                            <Typography component="div">
                                                <Box fontSize="h6.fontSize" m={1}>
                                                    No similar codewords
                                        </Box>
                                            </Typography>
                                        </Box>
                                    </Grid> : null
                                }

                            </Grid>
                        </Paper>

                        <Paper>
                            <Box display="flex" flexDirection="row" className={classes.heading}>
                                <Box p={1} width="100%" justifyContent="flex-start">
                                    <Typography component="div">
                                        <Box fontSize="h6.fontSize" m={1}>
                                            Anagrams
                                        </Box>
                                    </Typography>
                                </Box>


                            </Box>
                        </Paper>
                        <Paper className={classes.paper}>
                            {

                                loading ?
                                    <Grid container
                                        spacing={0}
                                        alignItems="center"
                                        justify="center"
                                       >
                                        <CircularProgress className={classes.progress} />
                                    </Grid> : false
                            }
                            <Grid container >
                                {listAnagrams.length > 0 ?
                                    listAnagrams
                                    : !loading?
                                    <Grid container>
                                        <Box p={1} width="100%" display="flex" justifyContent="center">
                                            <Typography component="div">
                                                <Box fontSize="h6.fontSize" m={1}>
                                                    No Anagrams
                                            </Box>
                                            </Typography>
                                        </Box>
                                    </Grid> : null
                                }

                            </Grid>
                        </Paper>
                    </Paper>
                </div>

            </Container>
        </div>
    )
}

