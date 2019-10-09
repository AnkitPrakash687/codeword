import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  palette: {
    primary: red[500],
    secondary: red[500],
  },

}));
const NavBar = (props) => {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleChange(event) {
    setAuth(event.target.checked);
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  let logoutButtonElement = null
  let profileImageButtonElement = null
  if (props.isLoggedIn) {
    logoutButtonElement =
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
      > logout </Button>

      profileImageButtonElement =  <IconButton
      key="close"
      aria-label="Close"
      color="inherit"
      className={classes.close}
      onClick={handleClose}
    >
      <PersonIcon />
    </IconButton>
        }
        return (
    <div className={classes.root}>

          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Codeword
          </Typography>
          {logoutButtonElement}
          {profileImageButtonElement}
            </Toolbar>
          </AppBar>
        </div>
        );
      }
export default NavBar;