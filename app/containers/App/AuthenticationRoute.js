import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { checkConnected } from './authService';

/* eslint react/prop-types: 0 */

const AuthenticationRoute = ({ component: Component, roleType, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (checkConnected()) {
        return (
          <Redirect
            to={{ pathname: '/app', state: { from: props.location } }}
          />
        );
      }
      return <Component {...props} />;
    }}
  />
);
export default AuthenticationRoute;
