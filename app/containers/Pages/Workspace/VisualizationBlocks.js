import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTitle, addChart } from 'dan-actions/workspaceActions';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import {
  withStyles,
  IconButton,
  Typography,
  Paper,
  TextField
} from '@material-ui/core';
import Ionicon from 'react-ionicons';
import PropTypes from 'prop-types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Axios from 'axios';
import ChartBlock from './ChartBlock';

const styles = theme => ({
  globalArea: {
    display: 'flex',
    justifyContent: 'space-around', // margin: `${theme.spacing(1)}px 0`,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      width: '100%'
    }
  },
  divCenter: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      '& button': {
        width: '100%',
        margin: 5
      }
    }
  },
  iconButton: {
    display: 'flex',
    flexDirection: 'column',
    height: 50,
    width: 50,
    '& svg': {
      width: '80%',
      height: '80%',
      verticalAlign: 'middle'
    }
  },
  iconRoot: {
    margin: '1%',
    fontSize: '100%'
  },
  title: {
    position: 'relative',
    textTransform: 'capitalize',
    fontSize: 24,
    fontWeight: 400,
    marginLeft: '2%',
    color:
      theme.palette.type === 'dark'
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      fontWeight: 600,
      marginBottom: theme.spacing(1)
    }
  },
  iconTitle: {
    borderRadius: theme.rounded.small,
    border:
      theme.palette.type === 'dark'
        ? 'none'
        : `1px solid ${lighten(theme.palette.primary.dark, 0.9)}`,
    boxShadow: `0 2px 15px -5px ${theme.palette.primary.main}`,
    background:
      theme.palette.type === 'dark'
        ? theme.palette.primary.main
        : lighten(theme.palette.primary.light, 0.5),
    width: 48,
    height: 48,
    textAlign: 'center',
    lineHeight: '44px',
    verticalAlign: 'middle',
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
    '& svg': {
      width: '60%',
      height: '60%',
      verticalAlign: 'middle',
      fill:
        theme.palette.type === 'dark'
          ? theme.palette.common.white
          : theme.palette.primary.main
    }
  },
  subtitle: {
    fontSize: 20,
    marginTop: theme.spacing(4)
  },
  circularProgress: {
    position: 'fixed',
    top: 'calc(50% - 75px)',
    left: 'calc(50% - 75px)'
  }
});

class VisualizationBlock extends Component {
  state = {
    id: 1,
    isRenameWorkspace: false,
    wsTitle: '',
    isSpinnerShowed: true
  };

  componentDidMount() {
    const { workspaceTitle, charts } = this.props;
    this.setState({
      wsTitle: workspaceTitle,
      id: charts.length
    });
    setTimeout(() => {
      this.setState({ isSpinnerShowed: false });
    }, 3000);
  }

  handleAddChart = () => {
    const { id } = this.state;
    const { addWorkspaceChart } = this.props;
    const chart = {
      id,
      settings: {
        choosedChart: '',
        axisList: [],
        chartParam: {
          axisX: '',
          title: '',
          xtitle: '',
          ytitle: '',
          showBrush: false,
          table: '',
          choosedColumns: ''
        },
        data: [{}]
      }
    };
    addWorkspaceChart(chart);
    this.setState({
      id: id + 1
    });
  };

  /* handleRemoveChart = id => {
    const { chartList } = this.state;
    let list = chartList;
    list = list.filter(item => item.id !== id);
    this.setState({
      chartList: list
    });
  }; */

  openReportEditor = () => {
    const { handleSetType } = this.props;
    handleSetType('report');
  };

  handleRenameWorkspaceText = event => {
    this.setState({
      wsTitle: event.target.value
    });
  };

  renameWorkspace = () => {
    this.setState({
      isRenameWorkspace: true
    });
  };

  backToList = () => {
    const { handleSetType } = this.props;
    handleSetType('workspaces');
  };

  renameWorkspaceDone = () => {
    const { setWorkspaceTitle } = this.props;
    const { wsTitle } = this.state;
    setWorkspaceTitle(wsTitle);
    this.setState({
      isRenameWorkspace: false
    });
  };

  saveWorkspace = () => {
    const { workspaceTitle, charts } = this.props;
    const obj = {
      title: workspaceTitle,
      creationTime: new Date()
    };
    const list = [];
    charts.forEach(chart => {
      const obj2 = {
        settings: JSON.stringify(chart.settings)
      };
      list.push(obj2);
    });
    const items = [obj, list];
    const { sub } = JSON.parse(sessionStorage.getItem('user'));
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.get(
      'http://localhost:9090/workspace/checkExistence/'
        + workspaceTitle
        + '&'
        + sub,
      config
    )
      .then(response => {
        if (!response.data) {
          Axios.post(
            'http://localhost:9090/workspace/save&' + sub,
            items,
            config
          )
            .then(response2 => {
              console.log(response2.data);
            })
            .catch(error => {
              console.log(error.message);
            });
        } else {
          const items2 = [obj, list];
          Axios.post('http://localhost:9090/workspace/update', items2, config)
            .then(response2 => {
              console.log(response2.data);
            })
            .catch(error => {
              console.log(error.message);
            });
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  render() {
    const { isRenameWorkspace, wsTitle, isSpinnerShowed } = this.state;
    const { classes, workspaceTitle, charts } = this.props;
    return (
      <div>
        {isSpinnerShowed ? (
          <div>
            <img
              src="/images/spinner.gif"
              alt="spinner"
              className={classes.circularProgress}
            />
            {/* <Typography variant="subtitle1" className={classes.subtitle}>
              Open
              {' '}
              {workspaceTitle}
            </Typography> */}
          </div>
        ) : (
          <div />
        )}
        <div
          style={
            isSpinnerShowed ? { pointerEvents: 'none', opacity: '0.4' } : {}
          }
        >
          {isRenameWorkspace ? (
            <Paper
              style={{
                height: '70px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              elevation={3}
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                style={{ width: '25%' }}
                required
                value={wsTitle}
                onChange={this.handleRenameWorkspaceText}
                className={classes.title}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}
              >
                <span className={classes.iconTitle}>
                  <Ionicon
                    icon="md-done-all"
                    onClick={this.renameWorkspaceDone}
                  />
                </span>
              </div>
            </Paper>
          ) : (
            <Paper
              style={{
                height: '70px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              elevation={3}
            >
              <Typography variant="h6" component="h2" className={classes.title}>
                {workspaceTitle}
              </Typography>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}
              >
                <span className={classes.iconTitle}>
                  <Ionicon
                    icon="ios-create-outline"
                    onClick={this.renameWorkspace}
                  />
                </span>
                <span className={classes.iconTitle}>
                  <Ionicon
                    icon="ios-bookmark-outline"
                    onClick={this.saveWorkspace}
                  />
                </span>
                <span className={classes.iconTitle}>
                  <Ionicon
                    icon="ios-document-outline"
                    onClick={this.openReportEditor}
                  />
                </span>
                <span className={classes.iconTitle}>
                  <Ionicon
                    icon="ios-list-box-outline"
                    onClick={this.backToList}
                  />
                </span>
              </div>
            </Paper>
          )}
          {charts.map((row, index) => (
            <ChartBlock id={index} />
            /* <div className={classes.divCenter}>
              <IconButton
                aria-label="Remove"
                classes={{ label: classes.iconButton }}
                onClick={() => this.handleRemoveChart(row.id)}
              >
                <HighlightOffIcon />
              </IconButton>
            </div> */
          ))}
          <div className={classes.divCenter}>
            <IconButton
              aria-label="Add"
              onClick={() => this.handleAddChart()}
              size="large"
              classes={{ root: classes.iconRoot, label: classes.iconButton }}
            >
              <AddCircleOutlineIcon />
              <div>Insert new Chart</div>
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

VisualizationBlock.propTypes = {
  classes: PropTypes.object.isRequired,
  workspaceTitle: PropTypes.string.isRequired,
  charts: PropTypes.array.isRequired,
  handleSetType: PropTypes.func.isRequired,
  addWorkspaceChart: PropTypes.func.isRequired,
  setWorkspaceTitle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  workspaceTitle: state.get('workspace').toJS().title,
  charts: state.get('workspace').toJS().charts
});

const mapDispatchToProps = dispatch => ({
  setWorkspaceTitle: bindActionCreators(setTitle, dispatch),
  addWorkspaceChart: bindActionCreators(addChart, dispatch)
});

const VisualizationBlockMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(VisualizationBlock);

export default withStyles(styles)(VisualizationBlockMapped);
