import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { checkConnected, getRole } from './authService';

/* eslint react/prop-types: 0 */

const PrivateRoute = ({ component: Component, roleTypes, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (!checkConnected()) {
        return (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        );
      }
      if (roleTypes && roleTypes.indexOf(getRole()) === -1) {
        return <Redirect to={{ pathname: '/app/pages/not-found' }} />;
      }
      return <Component {...props} />;
    }}
  />
);
export default PrivateRoute;
