import React from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        sessionStorage.getItem('token')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
    )} />
)

export default withRouter(PrivateRoute);