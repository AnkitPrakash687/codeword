import React, { useState, Component, useEffect } from 'react';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import API from '../../utils/API'
import { List, Grid, ListItem, ListItemText, Chip, Paper } from '@material-ui/core';
import MyAppBar from '../MyAppBar';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 20,
        flexGrow: 1,
        //  background: theme.palette.background.paper,
        background: lightGreen[200],
        minHeight: 500

    }, paper: {
        borderRadius: 5,
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    chip: {
        margin: theme.spacing(1)
    }
}));

export default function ReportCard(props) {
    const classes = useStyles();
    // const [codewords, setCodewords] = useState(props.items)
    const [chipData, setChipData] = React.useState(
        props.items.map((item, index) => {
            return ({ key: index, label: item })
        })
    )
    useEffect(() => {
        //  console.log('***prop***')
        console.log(props.items)

    })

    const handleDelete = chipToDelete => () => {
        console.log(chipToDelete.key)
        var data = {
            id: props.id,
            codeword: chipToDelete.label
        }
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.post('dashboard/deletecodeword', data, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                props.render()
                setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
            } else {

            }
        })

    }
    return (
        <div>
            
        <List dense={true}>
           {chipData.length > 1 &&
            <Paper className={classes.paper}>
                <Grid container direction="column">
                    {
                        chipData.map((item) => (
                            
                            <Chip
                                key={item.key}
                                label={item.label}
                                size="small"
                                className={classes.chip}
                                color="primary"
                                variant="outlined"
                                onDelete={handleDelete(item)}
                            />))
                    }
                </Grid>
            </Paper>
           }
        </List>
        </div>
    )
}

