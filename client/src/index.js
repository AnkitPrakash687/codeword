import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Signup from './component/Signup'
import NavBar from './component/Navbar'
import Login from './component/Login'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import store from "./store/index";
import history from './history'
import AppBar from './component/MyAppBar'
ReactDOM.render((
   <Router history={history}>
   
     <App/>
    </Router>
  ), document.getElementById('root'))

  
//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
