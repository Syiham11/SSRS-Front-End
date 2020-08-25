import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import {
  Parent,
  Import,
  WorkspacePage,
  MainDashboard,
  ControlPanel,
  Form,
  Table,
  Error,
  NotFound,
  Algorithms,
  Profile
} from '../pageListAsync';
import PrivateRoute from './PrivateRoute';

class Application extends React.Component {
  render() {
    const { changeMode, changeRandomTheme, history } = this.props;
    const roles1 = ['ADMIN', 'USER', 'ANALYST'];
    const roles2 = ['ADMIN', 'USER'];
    const roles3 = ['ADMIN'];
    return (
      <Dashboard
        history={history}
        changeMode={changeMode}
        changeRandomTheme={changeRandomTheme}
      >
        <Switch>
          <PrivateRoute exact path="/app" component={MainDashboard} />
          <PrivateRoute
            exact
            path="/app/profile"
            component={Profile}
            roleTypes={roles1}
          />
          <PrivateRoute
            exact
            path="/app/import"
            component={Import}
            roleTypes={roles1}
          />
          <PrivateRoute
            path="/app/workspace"
            component={WorkspacePage}
            roleTypes={roles2}
          />
          <PrivateRoute
            exact
            path="/app/control"
            component={ControlPanel}
            roleTypes={roles3}
          />
          <PrivateRoute
            exact
            path="/app/algorithms"
            component={Algorithms}
            roleTypes={roles1}
          />
          <PrivateRoute path="/app/form" component={Form} roleTypes={roles2} />
          <PrivateRoute path="/app/form" component={Form} roleTypes={roles2} />
          <PrivateRoute
            path="/app/table"
            component={Table}
            roleTypes={roles2}
          />
          <PrivateRoute
            path="/app/page-list"
            component={Parent}
            roleTypes={roles2}
          />
          <PrivateRoute path="/app/pages/not-found" component={NotFound} />
          <PrivateRoute path="/app/pages/error" component={Error} />
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

Application.propTypes = {
  changeMode: PropTypes.func.isRequired,
  changeRandomTheme: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default Application;
