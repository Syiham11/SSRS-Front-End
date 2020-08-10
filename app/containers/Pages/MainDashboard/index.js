import React from 'react';
// import { PapperBlock } from 'dan-components';
import {
  Grid, withStyles, Typography, Paper
} from '@material-ui/core';
import { PropTypes } from 'prop-types';
import Axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCharts } from 'dan-actions/dashboardActions';
import clockIcon from 'dan-images/icons/clock.png';
import analysisIcon from 'dan-images/icons/analysis.png';
import userIcon from 'dan-images/icons/user.png';
import infoIcon from 'dan-images/icons/info.png';
import styles from './Dashboard-jss';
import DSHBCharts from './DSHBCharts';
import TaskMenu from './TaskMenu';
import NewUserList from './NewUserList';

const apiURL = 'http://localhost:9090/dashboard';

class MainDashboard extends React.Component {
  state = {
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString()
  };

  componentDidMount() {
    this.intervalID = setInterval(() => this.updateClock(), 1000);
    const { setDashboardCharts } = this.props;
    const { sub } = JSON.parse(sessionStorage.getItem('user'));
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.get(apiURL + '/' + sub + '/charts', config).then(response => {
      if (response.data) {
        const list = [];
        const array = response.data;
        let id = 0;
        array.forEach(element => {
          const obj = {
            id,
            settings: JSON.parse(element.settings)
          };
          list.push(obj);
          id += 1;
        });
        setDashboardCharts(list);
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    const { setDashboardCharts } = this.props;
    const charts = [];
    setDashboardCharts(charts);
  }

  updateClock() {
    const { time } = this.state;
    if (time === '00:00:00') {
      this.setState({
        date: new Date().toLocaleDateString()
      });
    }
    this.setState({
      time: new Date().toLocaleTimeString()
    });
  }

  render() {
    const { classes } = this.props;
    const { time, date } = this.state;
    const { roles } = JSON.parse(sessionStorage.getItem('user'));
    return (
      <div>
        <Grid container>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={5} className={classes.cardContainer}>
              <div>
                <Typography
                  variant="h6"
                  style={{
                    color: '#FFF'
                  }}
                >
                  Profile
                </Typography>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: '#FFF'
                  }}
                >
                  Personal informations
                </Typography>
              </div>

              <img
                src={userIcon}
                alt="Report"
                style={{ height: '60%', aspectRatio: 1 }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={5} className={classes.cardContainer}>
              <div>
                <Typography
                  variant="h4"
                  style={{
                    color: '#FFF'
                  }}
                >
                  1
                </Typography>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: '#FFF'
                  }}
                >
                  card description
                </Typography>
              </div>
              <img
                src={analysisIcon}
                alt="Analysis"
                style={{ height: '60%', aspectRatio: 1 }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={5} className={classes.cardContainer}>
              <div>
                <Typography
                  variant="h4"
                  style={{
                    color: '#FFF'
                  }}
                >
                  2
                </Typography>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: '#FFF'
                  }}
                >
                  card descriptio
                </Typography>
              </div>
              <img
                src={infoIcon}
                alt="Info"
                style={{ height: '60%', aspectRatio: 1 }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={5} className={classes.cardContainer}>
              <div>
                <Typography
                  variant="h4"
                  style={{
                    color: '#FFF'
                  }}
                >
                  {time}
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    color: '#FFF'
                  }}
                >
                  {date}
                </Typography>
              </div>
              <img
                src={clockIcon}
                alt="clock"
                style={{ height: '60%', aspectRatio: 1 }}
              />
            </Paper>
          </Grid>
        </Grid>
        {/* <PapperBlock title="Charts" desc=""></PapperBlock> */}
        <DSHBCharts />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <TaskMenu style={{ width: '50%', height: '800px' }} />
          {roles.includes('ADMIN') ? (
            <NewUserList style={{ width: '50%', height: '800px' }} />
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

MainDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  setDashboardCharts: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  setDashboardCharts: bindActionCreators(setCharts, dispatch)
});

const MainDashboardMapped = connect(
  null,
  mapDispatchToProps
)(MainDashboard);

export default withStyles(styles)(MainDashboardMapped);
