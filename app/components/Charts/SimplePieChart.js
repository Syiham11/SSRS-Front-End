import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

let chart = null;

class SimplePieChart extends Component {
  componentDidMount() {
    const {
      axisList,
      chartParam,
      chartId,
      data,
      isReport,
      isDashboard
    } = this.props;
    chart = am4core.create('chart' + chartId, am4charts.PieChart);
    if (!isReport && !isDashboard) {
      chart.exporting.menu = new am4core.ExportMenu();
    }
    chart.paddingRight = 40;
    chart.padding(100, 100, 100, 100);
    chart.data = data;

    if (!isDashboard) {
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'bottom';
      chart.legend.labels.template.maxWidth = 95;
    }

    const title = chart.titles.create();
    title.text = chartParam.title;
    title.textAlign = 'middle';
    title.fontSize = 25;
    title.marginBottom = 20;

    axisList.map(prm => this.createSeries(prm.dataKey, prm.name, chartParam.axisX)
    );

    this.chart = chart;
  }

  componentDidUpdate(oldProps) {
    const { chartParam, data } = this.props;
    if (oldProps.data !== data) {
      chart.data = data;
      this.refrechPlots();
      chart.invalidateData();
    } else if (oldProps.chartParam.axisX !== chartParam.axisX) {
      this.refrechPlots();
      chart.invalidateData();
    } else if (oldProps.chartParam.title !== chartParam.title) {
      chart.titles.getIndex(0).text = chartParam.title;
    } else if (oldProps.chartParam.xtitle !== chartParam.xtitle) {
      chart.xAxes.getIndex(0).title.text = chartParam.xtitle;
    } else if (oldProps.chartParam.ytitle !== chartParam.ytitle) {
      chart.yAxes.getIndex(0).title.text = chartParam.ytitle;
    } else if (oldProps.chartParam.showBrush !== chartParam.showBrush) {
      chart.scrollbarX.disabled = !chartParam.showBrush;
      chart.scrollbarY.disabled = !chartParam.showBrush;
    } else {
      this.refrechPlots();
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  refrechPlots = () => {
    const { chartParam, axisList } = this.props;
    chart.series.clear();
    axisList.map(prm => this.createSeries(prm.dataKey, prm.name, chartParam.axisX)
    );
  };

  createSeries = (value, name, axisX) => {
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = value;
    pieSeries.dataFields.category = axisX;
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
  };

  render() {
    const { chartId } = this.props;
    return (
      <div
        id={'chart' + chartId}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    );
  }
}

SimplePieChart.propTypes = {
  axisList: PropTypes.array.isRequired,
  chartParam: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  chartId: PropTypes.number.isRequired,
  isReport: PropTypes.bool,
  isDashboard: PropTypes.bool
};

SimplePieChart.defaultProps = {
  isReport: false,
  isDashboard: false
};

export default SimplePieChart;
