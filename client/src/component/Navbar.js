import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';

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