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
import { setCharts } from 'dan-actions/workspaceActions';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { ChromePicker } from 'react-color';
import ChartTypesList from 'dan-components/Charts/ChartTypesList';
import DatawarehouseServices from '../../Services/datawarehouse';
import styles from '../Import/import-jss';

const types = [
  { id: 'area', name: 'area' },
  { id: 'bar', name: 'bar' },
  { id: 'line', name: 'line' }
];

class ChartSettings extends Component {
  state = {
    isChooseChart: false,
    isManagePlot: false,
    isTools: false,
    isChooseX: true,
    isChooseTable: true,
    isSpinnerShowed: false,
    selectedPlot: '',
    plotList: [],
    keys: [],
    id: 0,
    chartTitle: '',
    xTitle: '',
    yTitle: '',
    choosedColumns: ''
  };

  timeout = 0;

  componentDidMount() {
    const {
      axis, chartId, chartParam, data
    } = this.props;
    let keys = [];
    if (data[0] !== undefined) {
      keys = Object.keys(data[0]);
    }
    this.setState({
      isSpinnerShowed: false,
      keys
    });
    this.setState(
      {
        plotList: axis,
        chartTitle: chartParam.title,
        xTitle: chartParam.xtitle,
        yTitle: chartParam.ytitle,
        choosedColumns: chartParam.choosedColumns
      },
      () => {
        axis.forEach(element => {
          document.getElementById('btn' + chartId + element.id).style = 'background-color: ' + element.color + ';';
        });
      }
    );
  }

  handleDeleteChart = () => {
    const { chartId, charts, setWorkspaceCharts } = this.props;
    let newCharts = [];
    if (charts.length === 1) {
      newCharts = [];
    } else if (chartId === 0) {
      newCharts = charts.splice(1, charts.length);
    } else {
      newCharts = charts
        .splice(0, chartId)
        .concat(charts.splice(chartId, charts.length));
    }
    setWorkspaceCharts(newCharts);
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
    const {
      charts, setWorkspaceCharts, chartId, chartParam
    } = this.props;
    const chartList = JSON.parse(JSON.stringify(charts));
    const param = {
      ...chartParam,
      showBrush: !chartParam.showBrush
    };
    chartList[chartId].settings.chartParam = param;
    setWorkspaceCharts(chartList);
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
    this.setState(
      {
        plotList: list
      },
      function () {
        this.visualize();
      }
    );
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
    this.setState(
      {
        plotList: list
      },
      function () {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.visualize();
        }, 300);
      }
    );
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
    this.setState(
      {
        plotList: list
      },
      function () {
        this.visualize();
      }
    );
  };

  handleChooseTable = e => {
    const {
      charts, setWorkspaceCharts, chartId, chartParam
    } = this.props;
    const tableName = e.target.value;
    const param = {
      ...chartParam,
      table: tableName
    };
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[chartId].settings.chartParam = param;
    DatawarehouseServices.getDataByRows(tableName, 1).then(response => {
      let keys = [];
      if (response.data[0] !== undefined) {
        keys = Object.keys(response.data[0]);
      }
      this.setState(
        {
          keys
        },
        () => {
          setWorkspaceCharts(chartList);
        }
      );
    });
  };

  handleChooseX = e => {
    const {
      charts, setWorkspaceCharts, chartId, chartParam
    } = this.props;
    const param = {
      ...chartParam,
      axisX: e.target.value
    };
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[chartId].settings.chartParam = param;
    setWorkspaceCharts(chartList);
  };

  handleSetTitle = e => {
    const {
      charts, setWorkspaceCharts, chartId, chartParam
    } = this.props;
    const param = {
      ...chartParam,
      title: e.target.value
    };
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[chartId].settings.chartParam = param;
    this.setState({
      chartTitle: e.target.value
    });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      setWorkspaceCharts(chartList);
    }, 300);
  };

  /* setData = data => {
    const { charts, setWorkspaceCharts, chartId } = this.props;
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
    setWorkspaceCharts(chartList);
  }; */

  handleChooseColumns = e => {
    const col = e.target.value;
    this.setState({
      choosedColumns: col
    });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.prepareData(col);
    }, 300);
  };

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

  prepareData = columns => {
    const { chartParam } = this.props;
    const str = columns;
    const onlyNumberExp = /^\d+$/;
    const numberRangeExp = /^\d+;\d+$/;
    if (onlyNumberExp.test(str)) {
      const num = parseInt(str, 10);
      if (num <= 10 && num > 0) {
        DatawarehouseServices.getDataByRows(chartParam.table, num).then(
          response => {
            this.setTableData(response.data, columns);
          }
        );
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
        DatawarehouseServices.getDataByRange(
          chartParam.table,
          list[0],
          list[1]
        ).then(response => {
          this.setTableData(response.data, columns);
        });
      }
    }
  };

  setTableData = (data, columns) => {
    const {
      charts, setWorkspaceCharts, chartId, chartParam
    } = this.props;
    const param = {
      ...chartParam,
      choosedColumns: columns
    };
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[chartId].settings.chartParam = param;
    chartList[chartId].settings.data = data;
    setWorkspaceCharts(chartList);
  };

  handleSetXTitle = e => {
    const {
      charts, setWorkspaceCharts, chartId, chartParam
    } = this.props;
    const param = {
      ...chartParam,
      xtitle: e.target.value
    };
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[chartId].settings.chartParam = param;
    this.setState({
      xTitle: e.target.value
    });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      setWorkspaceCharts(chartList);
    }, 300);
  };

  handleSetYTitle = e => {
    const {
      charts, setWorkspaceCharts, chartId, chartParam
    } = this.props;
    const param = {
      ...chartParam,
      ytitle: e.target.value
    };
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[chartId].settings.chartParam = param;
    this.setState({
      yTitle: e.target.value
    });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      setWorkspaceCharts(chartList);
    }, 300);
  };

  visualize = () => {
    const { plotList } = this.state;
    const { charts, setWorkspaceCharts, chartId } = this.props;
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[chartId].settings.axisList = plotList;
    setWorkspaceCharts(chartList);
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
    this.visualize();
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
      function () {
        list.map(row => {
          document.getElementById('btn' + chartId + row.id).style = 'background-color: ' + row.color + ';';
          return null;
        });
        this.visualize();
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
                    name="attributeName"
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
    const {
      classes, tables, chartId, chartParam
    } = this.props;
    const {
      isChooseChart,
      isManagePlot,
      isTools,
      isChooseTable,
      isChooseX,
      isPickColor,
      chartTitle,
      xTitle,
      yTitle,
      choosedColumns,
      isSpinnerShowed,
      keys
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
                  name="attributeName"
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
                  name="attributeName"
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
                value={choosedColumns}
                onChange={this.handleChooseColumns}
                className={classes.textField}
              />
            </div>
          </Collapse>
          <div className={classes.divCenter}>
            <Button
              style={{ marginTop: '10px' }}
              endIcon={
                isChooseChart ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              onClick={this.handleShowChoose}
            >
              Chart Type
            </Button>
          </div>
          <Collapse in={isChooseChart}>
            <div className={classes.divCenter}>
              <ChartTypesList id={chartId} parent="workspace" />
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
              label="Insert Title"
              variant="outlined"
              fullWidth
              value={chartTitle}
              onChange={this.handleSetTitle}
              className={classes.textField}
            />
            <div className={classes.divSpace} style={{ marginBottom: '5%' }}>
              <TextField
                id="xTitleTextField"
                label="Insert X Axes Title"
                variant="outlined"
                value={xTitle}
                style={{ width: '48%' }}
                inputStyle={{ width: '100%' }}
                onChange={this.handleSetXTitle}
                className={classes.textField}
              />
              <TextField
                id="yTitleTextField"
                label="Insert Y Axes Title"
                variant="outlined"
                value={yTitle}
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
              endIcon={<BackspaceIcon />}
              style={{ marginTop: '10px' }}
              onClick={this.handleDeleteChart}
            >
              Delete chart
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
  setWorkspaceCharts: PropTypes.func.isRequired,
  choosedChart: PropTypes.string.isRequired,
  charts: PropTypes.array.isRequired,
  chartParam: PropTypes.object.isRequired,
  axis: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  charts: state.get('workspace').toJS().charts,
  choosedChart: state.get('workspace').toJS().charts[ownProps.chartId].settings
    .choosedChart,
  chartParam: state.get('workspace').toJS().charts[ownProps.chartId].settings
    .chartParam,
  axis: state.get('workspace').toJS().charts[ownProps.chartId].settings
    .axisList,
  data: state.get('workspace').toJS().charts[ownProps.chartId].settings.data
});

const mapDispatchToProps = dispatch => ({
  setWorkspaceCharts: bindActionCreators(setCharts, dispatch)
});

const ChartSettingsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartSettings);

export default withStyles(styles)(ChartSettingsMapped);
