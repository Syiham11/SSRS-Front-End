import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addChart } from 'dan-actions/dashboardActions';
import { withStyles, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import ChartBlock from './ChartBlock';

const styles = theme => ({
  divCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '350px',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      '& button': {
        width: '100%',
        margin: 5
      }
    }
  },
  divInline: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  iconButton: {
    position: 'fixed',
    top: '50%',
    right: theme.spacing(1)
  }
});

class VisualizationBlock extends Component {
  handleAddChart = () => {
    const { addDashboardChart } = this.props;
    const chart = {
      id: new Date().toString(),
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
          choosedColumns: '',
          delay: 0
        },
        data: [{}]
      }
    };
    addDashboardChart(chart);
  };

  /* handleRemoveChart = id => {
    const { chartList } = this.state;
    let list = chartList;
    list = list.filter(item => item.id !== id);
    this.setState({
      chartList: list
    });
  }; */

  render() {
    const { classes, charts } = this.props;
    return (
      <div>
        <Fab
          color="secondary"
          aria-label="Add chart"
          onClick={this.handleAddChart}
          className={classes.iconButton}
        >
          <AddIcon />
        </Fab>
        <div className={classes.divInline}>
          {charts.map((row, index) => (
            <ChartBlock id={index} style={{ width: ' 50%' }} />
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
        </div>
      </div>
    );
  }
}

VisualizationBlock.propTypes = {
  classes: PropTypes.object.isRequired,
  charts: PropTypes.array.isRequired,
  addDashboardChart: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  charts: state.get('dashboard').toJS().charts
});

const mapDispatchToProps = dispatch => ({
  addDashboardChart: bindActionCreators(addChart, dispatch)
});

const VisualizationBlockMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(VisualizationBlock);

export default withStyles(styles)(VisualizationBlockMapped);
