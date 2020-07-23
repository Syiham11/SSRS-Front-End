import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Header, SidebarBig, BreadCrumb } from 'dan-components';
import userMenu from 'dan-api/ui/userMenu';
import adminMenu from 'dan-api/ui/adminMenu';
import analystMenu from 'dan-api/ui/analystMenu';
import Decoration from '../Decoration';
import styles from '../appStyles-jss';

class LeftSidebarBigLayout extends React.Component {
  state = {
    dataMenu: []
  };

  componentDidMount() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      if (user.roles.includes('USER')) {
        this.setState({
          dataMenu: userMenu
        });
      } else if (user.roles.includes('ADMIN')) {
        this.setState({
          dataMenu: adminMenu
        });
      } else {
        this.setState({
          dataMenu: analystMenu
        });
      }
    }
  }

  render() {
    const {
      classes,
      children,
      toggleDrawer,
      sidebarOpen,
      loadTransition,
      pageLoaded,
      mode,
      gradient,
      deco,
      history,
      bgPosition,
      changeMode,
      changeRandomTheme,
      place,
      titleException,
      handleOpenGuide
    } = this.props;
    const { dataMenu } = this.state;
    return (
      <Fragment>
        <Header
          toggleDrawerOpen={toggleDrawer}
          margin={sidebarOpen}
          gradient={gradient}
          position="left-sidebar-big"
          changeMode={changeMode}
          changeRandomTheme={changeRandomTheme}
          mode={mode}
          title={place}
          history={history}
          openGuide={handleOpenGuide}
        />
        <SidebarBig
          dataMenu={dataMenu}
          loadTransition={loadTransition}
          open={sidebarOpen}
          toggleDrawerOpen={toggleDrawer}
        />
        <main
          className={classNames(
            classes.content,
            !sidebarOpen ? classes.contentPaddingLeftBig : ''
          )}
          id="mainContent"
        >
          <Decoration
            mode={mode}
            gradient={gradient}
            decoration={deco}
            bgPosition={bgPosition}
            horizontalMenu={false}
          />
          <section
            className={classNames(classes.mainWrap, classes.sidebarLayout)}
          >
            {titleException.indexOf(history.location.pathname) < 0 && (
              <div className={classes.pageTitle}>
                <Typography
                  component="h4"
                  className={
                    bgPosition === 'header'
                      ? classes.darkTitle
                      : classes.lightTitle
                  }
                  variant="h4"
                >
                  {place}
                </Typography>
                <BreadCrumb
                  separator=" / "
                  theme={bgPosition === 'header' ? 'dark' : 'light'}
                  location={history.location}
                />
              </div>
            )}
            {!pageLoaded && (
              <img
                src="/images/spinner.gif"
                alt="spinner"
                className={classes.circularProgress}
              />
            )}
            <Fade
              in={pageLoaded}
              mountOnEnter
              unmountOnExit
              {...(pageLoaded ? { timeout: 700 } : {})}
            >
              <div className={!pageLoaded ? classes.hideApp : ''}>
                {/* Application content will load here */}
                {children}
              </div>
            </Fade>
          </section>
        </main>
      </Fragment>
    );
  }
}

LeftSidebarBigLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  changeRandomTheme: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  pageLoaded: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  gradient: PropTypes.bool.isRequired,
  deco: PropTypes.bool.isRequired,
  bgPosition: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  titleException: PropTypes.array.isRequired,
  handleOpenGuide: PropTypes.func.isRequired
};

export default withStyles(styles)(LeftSidebarBigLayout);
