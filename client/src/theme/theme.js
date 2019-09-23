import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple'
import red from '@material-ui/core/colors/red'

export default createMuiTheme({
  palette: {
    primary: purple,
    secondary: red // Indigo is probably a good match with pink
  }
});