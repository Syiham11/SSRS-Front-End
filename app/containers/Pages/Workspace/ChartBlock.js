import React, { Component } from 'react';
import { PapperBlock } from 'dan-components';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import interact from 'interactjs';
import SimpleLineChart from 'dan-components/Charts/SimpleLineChart';
import SimpleAreaChart from 'dan-components/Charts/SimpleAreaChart';
import CompossedLineBarArea from 'dan-components/Charts/CompossedLineBarArea';
import SimpleBarChart from 'dan-components/Charts/SimpleBarChart';
import SimpleScatterChart from 'dan-components/Charts/SimpleScatterChart';
import SimpleRadarChart from 'dan-components/Charts/SimpleRadarChart';
import ChartSettings from './ChartSettings';
import SimplePieChart from '../../../components/Charts/SimplePieChart';
import DatawarehouseServices from '../../Services/datawarehouse';

class ChartBlock extends Component {
  state = {
    tables: []
  };

  componentDidMount() {
    DatawarehouseServices.getTables().then(response => {
      this.setState({
        tables: response.data
      });
    });

    interact('#chart').resizable({
      edges: {
        left: false,
        right: false,
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

  handleChangeChart = () => {
    const {
      id, choosedChart, data, axisList, chartParam
    } = this.props;
    switch (choosedChart) {
      case 'Compossed Chart':
        return (
          <CompossedLineBarArea
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
          />
        );
      case 'Percent Area Chart':
        return (
          <SimpleAreaChart
            percent
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
          />
        );
      case 'Line Chart':
        return (
          <SimpleLineChart
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
          />
        );
      case 'Area Chart':
        return (
          <SimpleAreaChart
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
          />
        );
      case 'Bar Chart':
        return (
          <SimpleBarChart
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
          />
        );
      case 'Pie Chart':
        return (
          <SimplePieChart
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
          />
        );
      case 'Radar Chart':
        return (
          <SimpleRadarChart
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
          />
        );
      case 'Scatter Chart':
        return (
          <SimpleScatterChart
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
          />
        );
      case 'Stacked Area Chart':
        return (
          <SimpleAreaChart
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            stacked
          />
        );
      case 'Stacked Bar Chart':
        return (
          <SimpleBarChart
            chartId={id}
            data={data}
            axisList={axisList}
            chartParam={chartParam}
            stacked
          />
        );
      default:
        return <div />;
    }
  };

  render() {
    const { tables } = this.state;
    const { choosedChart, id } = this.props;
    return (
      <div>
        <Grid
          container
          spacing={1}
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          <Grid item lg={3} xs={12}>
            <PapperBlock
              title="Chart Settings"
              whiteBg
              icon="ios-settings-outline"
              desc=""
            >
              <ChartSettings chartId={id} tables={tables} />
            </PapperBlock>
          </Grid>
          <Grid item lg={9} xs={12}>
            <PapperBlock
              title="Visualization"
              icon="ios-stats-outline"
              desc={choosedChart}
              whiteBg
            >
              <div
                id="chart"
                style={{
                  maxHeight: '1100px',
                  minHeight: '500px',
                  height: '800px',
                  width: '100%'
                }}
              >
                {this.handleChangeChart()}
              </div>
            </PapperBlock>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ChartBlock.propTypes = {
  id: PropTypes.number.isRequired,
  choosedChart: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  axisList: PropTypes.array.isRequired,
  chartParam: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  choosedChart: state.get('workspace').toJS().charts[ownProps.id].settings
    .choosedChart,
  data: state.get('workspace').toJS().charts[ownProps.id].settings.data,
  axisList: state.get('workspace').toJS().charts[ownProps.id].settings.axisList,
  chartParam: state.get('workspace').toJS().charts[ownProps.id].settings
    .chartParam
});

const ChartBlockMapped = connect(mapStateToProps)(ChartBlock);

export default ChartBlockMapped;
