import React, { Component } from 'react';
import {
  withStyles,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  TextField
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCharts } from 'dan-actions/dashboardActions';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { ChromePicker } from 'react-color';
import Axios from 'axios';
import styles from '../Import/import-jss';
import ChartTypesList from './ChartTypesList';

const types = [
  { id: 'area', name: 'area' },
  { id: 'bar', name: 'bar' },
  { id: 'line', name: 'line' }
];

const apiURL = 'http://localhost:9090/dashboard';
const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

class ChartSettings extends Component {
  state = {
    isChooseChart: true,
    isManagePlot: false,
    isTools: false,
    isChooseX: false,
    isChooseTable: false,
    isSpinnerShowed: false,
    selectedPlot: '',
    plotList: [],
    chartParam: {
      axisX: '',
      title: '',
      xtitle: '',
      ytitle: '',
      showBrush: false,
      table: '',
      choosedColumns: ''
    },
    data: [],
    keys: [],
    tables: [],
    chartType: '',
    id: 0
  };

  timeout = 0;

  componentDidMount() {
    const {
      axis,
      chartId,
      chartParam,
      data,
      tables,
      choosedChart
    } = this.props;
    let keys = [];
    if (data[0] !== undefined) {
      keys = Object.keys(data[0]);
    }
    this.setState(
      {
        isSpinnerShowed: false,
        tables,
        keys,
        data,
        plotList: axis,
        chartParam,
        chartType: choosedChart
      },
      () => {
        axis.forEach(element => {
          document.getElementById('btn' + chartId + element.id).style = 'background-color: ' + element.color + ';';
        });
      }
    );
  }

  componentWillUnmount() {
    console.log('settings disposed');
  }

  handleApplySettings = () => {
    const {
      charts, setDashboardCharts, chartId, closeDialog, updateDelay
    } = this.props;
    const {
      chartParam, plotList, data, chartType
    } = this.state;
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[chartId].settings.chartParam = chartParam;
    chartList[chartId].settings.axisList = plotList;
    chartList[chartId].settings.data = data;
    chartList[chartId].settings.choosedChart = chartType;

    const list = [];
    chartList.forEach(chart => {
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

    Axios.post(apiURL + '/save&' + sub, items, config)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.message);
      });
    setDashboardCharts(chartList);
    updateDelay(chartParam.delay);
    setTimeout(() => {
      closeDialog();
    }, 300);
  };

  handleShowChoose = () => {
    const { isChooseChart } = this.state;
    this.setState({
      isChooseChart: !isChooseChart
    });
  };

  handleShowPlot = () => {
    const { isManagePlot } = this.state;
    this.setState({
      isManagePlot: !isManagePlot
    });
  };

  handleShowTools = () => {
    const { isTools } = this.state;
    this.setState({
      isTools: !isTools
    });
  };

  handleShowTableChoose = () => {
    const { isChooseTable } = this.state;
    this.setState({
      isChooseTable: !isChooseTable
    });
  };

  handleShowX = () => {
    const { isChooseX } = this.state;
    this.setState({
      isChooseX: !isChooseX
    });
  };

  handleShowBrush = () => {
    const { chartParam } = this.state;
    const param = {
      ...chartParam,
      showBrush: !chartParam.showBrush
    };

    this.setState({
      chartParam: param
    });
  };

  handleChoosePlot = (id, e) => {
    const { plotList } = this.state;
    const index = plotList.findIndex(pl => pl.id === id);
    const list = JSON.parse(JSON.stringify(plotList));
    list[index] = {
      id: list[index].id,
      dataKey: e.target.value,
      color: list[index].color,
      type: list[index].type,
      name: e.target.value
    };
    this.setState({
      plotList: list
    });
  };

  handleSetPlotName = (id, e) => {
    const { plotList } = this.state;
    const index = plotList.findIndex(pl => pl.id === id);
    const list = JSON.parse(JSON.stringify(plotList));
    list[index] = {
      id: list[index].id,
      dataKey: list[index].dataKey,
      color: list[index].color,
      type: list[index].type,
      name: e.target.value
    };
    this.setState({
      plotList: list
    });
  };

  handleChoosePlotType = (id, e) => {
    const { plotList } = this.state;
    const list = JSON.parse(JSON.stringify(plotList));
    const index = list.findIndex(pl => pl.id === id);
    list[index] = {
      id: list[index].id,
      dataKey: list[index].dataKey,
      color: list[index].color,
      type: e.target.value,
      name: list[index].name
    };
    this.setState({
      plotList: list
    });
  };

  handleChooseTable = e => {
    const { chartParam } = this.state;
    this.setState({
      isSpinnerShowed: true
    });
    const param = {
      ...chartParam,
      table: e.target.value
    };
    this.setState({
      chartParam: param
    });
    Axios.get(
      apiURL + '/data/getbyrows/' + e.target.value + '&' + 1,
      config
    ).then(response => {
      let keys = [];
      if (response.data[0] !== undefined) {
        keys = Object.keys(response.data[0]);
      }
      this.setState({
        isSpinnerShowed: false,
        keys
      });
    });
  };

  handleChooseX = e => {
    const { chartParam } = this.state;
    const param = {
      ...chartParam,
      axisX: e.target.value
    };
    this.setState({
      chartParam: param
    });
  };

  handleSetDelay = e => {
    const { chartParam } = this.state;
    const param = {
      ...chartParam,
      delay: e.target.value
    };
    this.setState({
      chartParam: param
    });
  };

  handleSetTitle = e => {
    const { chartParam } = this.state;
    const param = {
      ...chartParam,
      title: e.target.value
    };
    this.setState({
      chartParam: param
    });
  };

  handleSetChartType = type => {
    this.setState({
      chartType: type
    });
  };

  /* setData = data => {
    const { charts, setDashboardCharts, chartId } = this.props;
    const chartList = JSON.parse(JSON.stringify(charts));
    for (let i = 0; i < chartList.length; i += 1) {
      if (chartList[i].id === chartId) {
        chartList[i].settings.data = data;
        break;
      }
    }
    this.setState({
      data
    });
    setDashboardCharts(chartList);
  }; */

  /* handleChooseColumns = e => {
    const col = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.prepareData(col);
    }, 300);
  }; */

  /* prepareData = columns => {
    const { data } = this.state;
    const { chartParam } = this.props;
    const str = columns;
    const onlyNumberExp = /^\d+$/;
    // const numberListExp = /^(\d+,){1,9}\d+$/;
    const numberRangeExp = /^\d+;\d+$/;
    //const stringListExp = /^([\w\s]+,){1,9}[\w\s]+$/;
    //const stringListExp2 = /^('[\w\s]+',){1,9}'[\w\s]+'$/;
    if (onlyNumberExp.test(str)) {
      console.log('only number');
      const num = parseInt(str, 10);
      let newData = [];
      if (num <= 10 && num > 0 && num <= data.length) {
        for (let i = 0; i < num; i += 1) {
          newData.push(data[i]);
        }
      } else newData = [{}];
      this.setTableData(newData, columns);
    } else if (numberListExp.test(str)) {
      const numList = str.replace(/[{}]/g, '');
      const list = numList.split(',');
      let newData = [];
      if (list.length <= 10 && list.length > 0 && list.length <= data.length) {
        for (let i = 0; i < list.length; i += 1) {
          if (data[parseInt(list[i], 10) - 1] !== undefined) {
            newData.push(data[parseInt(list[i], 10) - 1]);
          }
        }
      } else newData = [{}];
      this.setTableData(newData, columns);
    } else if (numberRangeExp.test(str)) {
      const numList = str.replace(/[{}]/g, '');
      const list = numList.split(';');
      const numOfElements = parseInt(list[1], 10) - parseInt(list[0], 10) + 1;
      let newData = [];
      if (
        numOfElements <= 10
        && numOfElements > 0
        && numOfElements <= data.length
        && parseInt(list[0], 10) < parseInt(list[1], 10)
      ) {
        for (
          let i = parseInt(list[0], 10) - 1;
          i < parseInt(list[1], 10);
          i += 1
        ) {
          if (data[i] !== null) {
            newData.push(data[i]);
          }
        }
      } else newData = [{}];
      this.setTableData(newData, columns);
    } else if (stringListExp.test(str) || stringListExp2.test(str)) {
      const stringList = str.replace(/[{}']/g, '');
      const list = stringList.split(',');
      const axis = chartParam.axisX;
      let newData = [];
      if (list.length <= 10 && list.length > 0 && list.length <= data.length) {
        for (let i = 0; i < list.length; i += 1) {
          for (let j = 0; j < data.length; j += 1) {
            if (data[j][axis].toString() === list[i]) {
              newData.push(data[j]);
            }
          }
        }
      } else newData = [{}];
      this.setTableData(newData, columns);
    }
  }; */

  handleChooseColumns = e => {
    const { chartParam } = this.state;
    const columns = e.target.value;
    const str = columns;
    const onlyNumberExp = /^\d+$/;
    const numberRangeExp = /^\d+;\d+$/;
    if (onlyNumberExp.test(str)) {
      const num = parseInt(str, 10);
      if (num <= 10 && num > 0) {
        Axios.get(
          apiURL + '/data/getbyrows/' + chartParam.table + '&' + num,
          config
        ).then(response => {
          this.setTableData(response.data, columns);
        });
      }
    } else if (numberRangeExp.test(str)) {
      const numList = str.replace(/[{}]/g, '');
      const list = numList.split(';');
      const numOfElements = parseInt(list[1], 10) - parseInt(list[0], 10) + 1;
      if (
        numOfElements <= 10
        && numOfElements > 0
        && parseInt(list[0], 10) < parseInt(list[1], 10)
      ) {
        Axios.get(
          apiURL
            + '/data/getbyrange/'
            + chartParam.table
            + '&'
            + list[0]
            + '&'
            + list[1],
          config
        ).then(response => {
          this.setTableData(response.data, columns);
        });
      }
    }
  };

  setTableData = (data, columns) => {
    const { chartParam } = this.state;
    const param = {
      ...chartParam,
      choosedColumns: columns
    };
    this.setState({
      data,
      chartParam: param
    });
  };

  handleSetXTitle = e => {
    const { chartParam } = this.state;
    const param = {
      ...chartParam,
      xtitle: e.target.value
    };
    this.setState({
      chartParam: param
    });
  };

  handleSetYTitle = e => {
    const { chartParam } = this.state;
    const param = {
      ...chartParam,
      ytitle: e.target.value
    };
    this.setState({
      chartParam: param
    });
  };

  visualize = () => {
    const { plotList } = this.state;
    const { charts, setDashboardCharts, chartId } = this.props;
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[chartId].settings.axisList = plotList;
    setDashboardCharts(chartList);
  };

  handleChangeColor = color => {
    const { selectedPlot, plotList } = this.state;
    const { chartId } = this.props;
    const index = plotList.findIndex(pl => pl.id === selectedPlot);
    const list = JSON.parse(JSON.stringify(plotList));
    list[index] = {
      id: list[index].id,
      dataKey: list[index].dataKey,
      color: color.hex,
      type: list[index].type,
      name: list[index].name
    };
    this.setState({
      plotList: list
    });
    document.getElementById('btn' + chartId + selectedPlot).style = 'background-color: ' + color.hex + ';';
  };

  handleAddPlot = () => {
    const { plotList, id } = this.state;
    this.setState({
      plotList: plotList.concat({
        id,
        dataKey: '',
        color: '',
        type: 'area',
        name: ''
      }),
      id: id + 1
    });
  };

  handleRemovePlot = id => {
    const { plotList } = this.state;
    const { chartId } = this.props;
    let list;
    list = plotList;
    list = list.filter(item => item.id !== id);
    this.setState(
      {
        plotList: list
      },
      () => {
        list.map(row => {
          document.getElementById('btn' + chartId + row.id).style = 'background-color: ' + row.color + ';';
          return null;
        });
      }
    );
  };

  renderPlotParameters = () => {
    const { classes, chartId, choosedChart } = this.props;
    const { plotList, keys } = this.state;
    return (
      <Grid
        container
        spacing={3}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          {plotList.map(row => (
            <div>
              <div className={classes.divSpace}>
                <FormControl
                  className={classes.formControl}
                  style={{ minWidth: '48%' }}
                >
                  <InputLabel>Choose plot</InputLabel>
                  <Select
                    name="plots"
                    value={row.dataKey}
                    onChange={e => this.handleChoosePlot(row.id, e)}
                  >
                    {keys.map(key => (
                      <MenuItem key={key + chartId} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  id="plotNameTextField"
                  label="Insert Name"
                  variant="outlined"
                  style={{ width: '48%' }}
                  inputStyle={{ width: '100%' }}
                  value={row.name}
                  onChange={e => this.handleSetPlotName(row.id, e)}
                  className={classes.textField}
                />
              </div>
              <div>
                {choosedChart === 'Compossed Chart' ? (
                  <FormControl className={classes.formControl} fullWidth>
                    <InputLabel>Choose plot type</InputLabel>
                    <Select
                      name="plotType"
                      value={row.type}
                      onChange={e => this.handleChoosePlotType(row.id, e)}
                    >
                      {types.map(type => (
                        <MenuItem key={type.id + chartId} value={type.name}>
                          {type.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <div />
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: 10
                }}
              >
                <Button
                  id={'btn' + chartId + row.id}
                  onClick={() => this.openColorDialog(row.id)}
                  style={{ border: '1px solid gray' }}
                />
                <IconButton
                  aria-label="Remove"
                  className={classes.margin}
                  onClick={() => this.handleRemovePlot(row.id)}
                >
                  <HighlightOffIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </Grid>
      </Grid>
    );
  };

  handleDialogClose = () => {
    this.setState({
      isPickColor: false
    });
  };

  openColorDialog = plot => {
    this.setState({
      isPickColor: true,
      selectedPlot: plot
    });
  };

  render() {
    const { classes, chartId } = this.props;
    const {
      isChooseChart,
      isManagePlot,
      isTools,
      isChooseTable,
      isChooseX,
      isPickColor,
      isSpinnerShowed,
      keys,
      tables,
      chartParam
    } = this.state;
    return (
      <div>
        {isSpinnerShowed ? (
          <div>
            <img
              src="/images/spinner.gif"
              alt="spinner"
              className={classes.circularProgress}
            />
          </div>
        ) : (
          <div />
        )}
        <div
          style={
            isSpinnerShowed ? { pointerEvents: 'none', opacity: '0.4' } : {}
          }
        >
          <Dialog
            maxWidth="sm"
            aria-labelledby="PickColor"
            open={isPickColor}
            onClose={this.handleDialogClose}
            BackdropProps={{
              style: {
                backgroundColor: 'transparent'
              }
            }}
            PaperProps={{
              style: {
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }
            }}
          >
            <DialogContent>
              <ChromePicker
                color="#FFF"
                onChangeComplete={this.handleChangeColor}
                disableAlpha
                width="450px"
              />
            </DialogContent>
          </Dialog>
          <div className={classes.divCenter}>
            <Button
              endIcon={
                isChooseChart ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              onClick={this.handleShowChoose}
            >
              Choose Chart Type
            </Button>
          </div>
          <Collapse in={isChooseChart}>
            <div className={classes.divCenter}>
              <ChartTypesList handleSetChartType={this.handleSetChartType} />
            </div>
          </Collapse>
          <div className={classes.divCenter}>
            <Button
              style={{ marginTop: '10px' }}
              endIcon={
                isChooseTable ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              onClick={this.handleShowTableChoose}
            >
              Table
            </Button>
          </div>
          <Collapse in={isChooseTable}>
            <div className={classes.divCenter}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel>Choose Table</InputLabel>
                <Select
                  name="chooseTable"
                  value={chartParam.table}
                  onChange={this.handleChooseTable}
                >
                  {tables.map(table => (
                    <MenuItem key={table + chartId} value={table}>
                      {table}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Collapse>
          <div className={classes.divCenter}>
            <Button
              style={{ marginTop: '10px' }}
              endIcon={
                isChooseX ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              onClick={this.handleShowX}
            >
              Axis X
            </Button>
          </div>
          <Collapse in={isChooseX}>
            <div className={classes.divCenter}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel>Choose Axis X</InputLabel>
                <Select
                  name="AxisX"
                  value={chartParam.axisX}
                  onChange={this.handleChooseX}
                >
                  {keys.map(key => (
                    <MenuItem key={key + chartId} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={classes.divCenter}>
              <TextField
                id="columnsChooseTextfield"
                label="Columns to visualize"
                variant="outlined"
                fullWidth
                value={chartParam.choosedColumns}
                onChange={this.handleChooseColumns}
                className={classes.textField}
              />
            </div>
          </Collapse>
          <div className={classes.divCenter}>
            <Button
              style={{ marginTop: '10px' }}
              endIcon={
                isManagePlot ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              onClick={this.handleShowPlot}
            >
              Plots
            </Button>
          </div>
          <Collapse in={isManagePlot}>
            {this.renderPlotParameters()}
            <div className={classes.divCenter}>
              <IconButton
                aria-label="Add"
                className={classes.margin}
                onClick={this.handleAddPlot}
                size="large"
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </div>
          </Collapse>
          <div className={classes.divCenter}>
            <Button
              style={{ marginTop: '10px' }}
              endIcon={
                isTools ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              onClick={this.handleShowTools}
            >
              Tools
            </Button>
          </div>
          <Collapse in={isTools}>
            <TextField
              id="titleTextField"
              label="Update data after (minutes)"
              variant="outlined"
              fullWidth
              value={chartParam.delay}
              onChange={this.handleSetDelay}
              className={classes.textField}
            />
            <TextField
              id="titleTextField"
              label="Insert Title"
              variant="outlined"
              fullWidth
              value={chartParam.title}
              onChange={this.handleSetTitle}
              className={classes.textField}
            />
            <div className={classes.divSpace} style={{ marginBottom: '5%' }}>
              <TextField
                id="xTitleTextField"
                label="Insert X Axes Title"
                variant="outlined"
                value={chartParam.xTitle}
                style={{ width: '48%' }}
                inputStyle={{ width: '100%' }}
                onChange={this.handleSetXTitle}
                className={classes.textField}
              />
              <TextField
                id="yTitleTextField"
                label="Insert Y Axes Title"
                variant="outlined"
                value={chartParam.yTitle}
                style={{ width: '48%' }}
                inputStyle={{ width: '100%' }}
                onChange={this.handleSetYTitle}
                className={classes.textField}
              />
            </div>
            <div className={classes.divCenter}>
              <Button
                endIcon={
                  chartParam.showBrush ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )
                }
                onClick={this.handleShowBrush}
              >
                {chartParam.showBrush ? 'Hide Ruler' : 'Show Ruler'}
              </Button>
            </div>
          </Collapse>
          <div className={classes.divCenter}>
            <Button
              className={classes.button}
              onClick={this.handleApplySettings}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

ChartSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  chartId: PropTypes.number.isRequired,
  tables: PropTypes.array.isRequired,
  setDashboardCharts: PropTypes.func.isRequired,
  choosedChart: PropTypes.string.isRequired,
  charts: PropTypes.array.isRequired,
  chartParam: PropTypes.object.isRequired,
  axis: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  closeDialog: PropTypes.func.isRequired,
  updateDelay: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  charts: state.get('dashboard').toJS().charts,
  choosedChart: state.get('dashboard').toJS().charts[ownProps.chartId].settings
    .choosedChart,
  chartParam: state.get('dashboard').toJS().charts[ownProps.chartId].settings
    .chartParam,
  axis: state.get('dashboard').toJS().charts[ownProps.chartId].settings
    .axisList,
  data: state.get('dashboard').toJS().charts[ownProps.chartId].settings.data
});

const mapDispatchToProps = dispatch => ({
  setDashboardCharts: bindActionCreators(setCharts, dispatch)
});

const ChartSettingsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartSettings);

export default withStyles(styles)(ChartSettingsMapped);
