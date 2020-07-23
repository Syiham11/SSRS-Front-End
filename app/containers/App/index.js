import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Auth from './Auth';
import Application from './Application';
import LoginDedicated from '../Pages/Standalone/LoginDedicated';
import ThemeWrapper, { AppContext } from './ThemeWrapper';
import AuthenticationRoute from './AuthenticationRoute';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends React.Component {
  render() {
    return (
      <ThemeWrapper>
        <AppContext.Consumer>
          {value => (
            <Switch>
              <AuthenticationRoute path="/" exact component={LoginDedicated} />
              <Route
                path="/app"
                render={props => (
                  <Application
                    {...props}
                    changeMode={value.changeMode}
                    changeRandomTheme={value.changeRandomTheme}
                  />
                )}
              />
              <Route component={Auth} />
              <Route component={NotFound} />
            </Switch>
          )}
        </AppContext.Consumer>
      </ThemeWrapper>
    );
  }
}

export default App;
