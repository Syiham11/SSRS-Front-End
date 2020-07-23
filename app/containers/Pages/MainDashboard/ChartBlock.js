import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  Paper,
  IconButton,
  Dialog,
  DialogContent
} from '@material-ui/core';
import { setCharts } from 'dan-actions/dashboardActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import interact from 'interactjs';
import Ionicon from 'react-ionicons';
import SimpleLineChart from 'dan-components/Charts/SimpleLineChart';
import SimpleAreaChart from 'dan-components/Charts/SimpleAreaChart';
import CompossedLineBarArea from 'dan-components/Charts/CompossedLineBarArea';
import SimpleBarChart from 'dan-components/Charts/SimpleBarChart';
import SimpleScatterChart from 'dan-components/Charts/SimpleScatterChart';
import SimpleRadarChart from 'dan-components/Charts/SimpleRadarChart';
import styles from './Dashboard-jss';
import ChartSettings from './ChartSettings';
import SimplePieChart from '../../../components/Charts/SimplePieChart';

const apiURL = 'http://localhost:9090/datawarehouse';
const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

export class ChartBlock extends Component {
  state = {
    fullSize: false,
    isSettings: false,
    tables: []
  };

  componentDidMount() {
    const { chartParam } = this.props;
    if (chartParam.delay !== undefined) {
      this.intervalID = setInterval(() => this.updateData(), chartParam.delay);
    }
    Axios.get(apiURL + '/tables', config).then(response => {
      this.setState({
        tables: response.data
      });
    });

    interact('#chart').resizable({
      edges: {
        left: false,
        right: true,
        bottom: true,
        top: false
      },

      listeners: {
        move(event) {
          const { target } = event;
          let x = parseFloat(target.getAttribute('data-x')) || 0;
          let y = parseFloat(target.getAttribute('data-y')) || 0;
          target.style.width = event.rect.width + 'px';
          target.style.height = event.rect.height + 'px';
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.webkitTransform = 'translate(' + x + 'px,' + y + 'px)';
          target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  updateDelay = delay => {
    clearInterval(this.intervalID);
    if (delay !== undefined && delay > 0) {
      this.intervalID = setInterval(() => this.updateData(), delay);
    }
  };

  updateData = () => {
    console.log('update');
  };

  handleDeleteChart = () => {
    const { id, charts } = this.props;
    console.log('delete ' + id);
    console.log(charts);
    const list = [0, 1, 2, 3];
    let newCharts = [];
    if (id === 0) {
      console.log(list.splice(1, list.length));
      newCharts = charts.splice(1, charts.length);
      console.log(newCharts);
    } else {
      console.log(list.splice(0, id).concat(list.splice(id, list.length)));
      newCharts = charts.splice(0, id).concat(charts.splice(id, charts.length));
      console.log(newCharts);
    }
    console.log(newCharts);
    this.updateDashboard(newCharts);
  };

  updateDashboard = charts => {
    const { setDashboardCharts } = this.props;
    const list = [];
    charts.forEach(chart => {
      const obj2 = {
        settings: JSON.stringify(chart.settings)
      };
      list.push(obj2);
    });
    const obj = {
      lastEditTime: new Date()
    };
    const items = [obj, list];
    const { sub } = JSON.parse(sessionStorage.getItem('user'));

    Axios.post('http://localhost:9090/dashboard/save&' + sub, items, config)
      .then(response => {
        console.log(response.data);
        setDashboardCharts(charts);
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  handleDialogClose = () => {
    this.setState({
      isSettings: false
    });
  };

  handleOpenSettings = () => {
    this.setState({
      isSettings: true
    });
  };

  handleChangeChart = () => {
    const {
      id, choosedChart, data, axisList, chartParam, chart
    } = this.props;
    console.log(id);
    console.log(chart);
    switch (choosedChart) {
      case 'Compossed Chart':
        return (
          <CompossedLineBarArea
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
          />
        );
      case 'Percent Area Chart':
        return (
          <SimpleAreaChart
            percent
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            isDashboard
          />
        );
      case 'Line Chart':
        return (
          <SimpleLineChart
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            isDashboard
          />
        );
      case 'Area Chart':
        return (
          <SimpleAreaChart
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            isDashboard
          />
        );
      case 'Bar Chart':
        return (
          <SimpleBarChart
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            isDashboard
          />
        );
      case 'Pie Chart':
        return (
          <SimplePieChart
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            isDashboard
          />
        );
      case 'Radar Chart':
        return (
          <SimpleRadarChart
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            isDashboard
          />
        );
      case 'Scatter Chart':
        return (
          <SimpleScatterChart
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            isDashboard
          />
        );
      case 'Stacked Area Chart':
        return (
          <SimpleAreaChart
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            stacked
            isDashboard
          />
        );
      case 'Stacked Bar Chart':
        return (
          <SimpleBarChart
            chartId={'dashboard' + id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            stacked
            isDashboard
          />
        );
      default:
        return <div />;
    }
  };

  render() {
    const { fullSize, isSettings, tables } = this.state;
    const { classes, id } = this.props;
    console.log(fullSize);
    return (
      <div>
        <Dialog
          maxWidth="sm"
          aria-labelledby="PickColor"
          open={isSettings}
          onClose={this.handleDialogClose}
        >
          <DialogContent>
            <ChartSettings
              chartId={id}
              tables={tables}
              closeDialog={this.handleDialogClose}
              updateDelay={this.updateDelay}
            />
          </DialogContent>
        </Dialog>
        <Paper elevation={3} id="chart" className={classes.chartGrid}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              height: '30px'
            }}
          >
            <IconButton onClick={this.handleOpenSettings}>
              <Ionicon icon="ios-settings" />
            </IconButton>
            <IconButton onClick={this.handleDeleteChart}>
              <Ionicon icon="ios-close" />
            </IconButton>
          </div>
          <div
            style={{
              height: 'calc(100% - 80px)',
              width: '100%'
            }}
          >
            {this.handleChangeChart()}
          </div>
        </Paper>
      </div>
    );
  }
}

ChartBlock.propTypes = {
  id: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  choosedChart: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  axisList: PropTypes.array.isRequired,
  chartParam: PropTypes.object.isRequired,
  setDashboardCharts: PropTypes.func.isRequired,
  chart: PropTypes.object.isRequired,
  charts: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  choosedChart: state.get('dashboard').toJS().charts[ownProps.id].settings
    .choosedChart,
  data: state.get('dashboard').toJS().charts[ownProps.id].settings.data,
  axisList: state.get('dashboard').toJS().charts[ownProps.id].settings.axisList,
  chartParam: state.get('dashboard').toJS().charts[ownProps.id].settings
    .chartParam,
  chart: state.get('dashboard').toJS().charts[ownProps.id],
  charts: state.get('dashboard').toJS().charts
});

const mapDispatchToProps = dispatch => ({
  setDashboardCharts: bindActionCreators(setCharts, dispatch)
});

const ChartBlockMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartBlock);

export default withStyles(styles)(ChartBlockMapped);
