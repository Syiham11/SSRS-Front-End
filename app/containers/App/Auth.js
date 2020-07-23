import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Outer from '../Templates/Outer';
import {
  Login,
  Register,
  ResetPassword,
  ComingSoon,
  Maintenance,
  NotFound,
} from '../pageListAsync';
import AuthenticationRoute from './AuthenticationRoute';

class Auth extends React.Component {
  render() {
    return (
      <Outer>
        <Switch>
          <AuthenticationRoute path="/login" component={Login} />
          <AuthenticationRoute path="/register" component={Register} />
          <AuthenticationRoute path="/reset-password" component={ResetPassword} />
          <AuthenticationRoute path="/maintenance" component={Maintenance} />
          <AuthenticationRoute path="/coming-soon" component={ComingSoon} />
          <Route component={NotFound} />
        </Switch>
      </Outer>
    );
  }
}

export default Auth;
