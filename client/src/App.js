import React, { useState, Component, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './component/Navbar'
import AppBar from './component/MyAppBar'
import Login from './component/Login'
import Dashboard from './component/Dashboard'
import Course from './component/instructor/Course'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import Signup from './component/Signup'
import CodewordSet from './component/codewordset/CodewordSet'
//import history from './helper/history'
import PrivateRoute from './component/PrivateRoute'
import StudentDashboard from './component/student/StudentDashboard';
import ResetPassword from './component/ResetPassword'
import ForgotPassword from './component/ForgotPassword'
import VerifyEmail from './component/VerifyEmail'

export default function App() {


useEffect(()=>{
  //  sessionStorage.clear()
},[])
 

  
  return (
    <Router >
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute exact path="/course/:id" component={Course} />
        <PrivateRoute exact path="/codewordset/:id" component={CodewordSet} />
        <PrivateRoute path="/studentview" component={StudentDashboard}/>
        <Route exact path="/signin" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route path="/forgotPassword/" component={ForgotPassword} />
        <Route path="/resetPassword/:token" component={ResetPassword} />
        <Route path="/verifyEmail/:token" component={VerifyEmail} />
    </Router>
  );
}

