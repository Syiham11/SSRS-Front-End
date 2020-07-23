import React, { Component } from 'react';
import {
  withStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  undoData,
  redoData,
  setData,
  clearDataHistory
} from 'dan-actions/importedDataActions';
import UndoOutlinedIcon from '@material-ui/icons/UndoOutlined';
import RedoOutlinedIcon from '@material-ui/icons/RedoOutlined';
import SettingsBackupRestoreOutlinedIcon from '@material-ui/icons/SettingsBackupRestoreOutlined';
import styles from './import-jss';
import data from '../Workspace/sampleData1';
import data1 from '../Workspace/sampleData2';

const tables = [
  { id: 'table1', name: 'table 1' },
  { id: 'table2', name: 'table 2' }
];

const mergeTypes = [
  { id: 'Horizontal', name: 'Horizontal' },
  { id: 'Vertical', name: 'Vertical' }
];

const joinTypes = [
  { id: 'innerJoin', name: 'Inner Join' },
  { id: 'leftJoin', name: 'Left Join' },
  { id: 'rightJoin', name: 'Right Join' },
  { id: 'fullOuterJoin', name: 'Full Outer Join' }
];

class MergeData extends Component {
  state = {
    selectedTable: '',
    choosedMerge: '',
    choosedJoin: '',
    choosedReference: '',
    isSpinnerShowed: false
  };

  handleTableChange = event => {
    const { showMergedTable, handleSetData } = this.props;
    this.setState({
      selectedTable: event.target.value
    });
    if (event.target.value === 'table 1') {
      handleSetData(data);
    } else handleSetData(data1);
    showMergedTable(true);
  };

  handleMergeTypeChange = event => {
    this.setState({
      choosedMerge: event.target.value
    });
  };

  handleJoinTypeChange = event => {
    this.setState({
      choosedJoin: event.target.value
    });
  };

  handleReferenceChange = event => {
    this.setState({
      choosedReference: event.target.value
    });
  };

  handleRestoreClick = () => {
    const { setTableData, originalData, onClear } = this.props;
    setTableData(originalData);
    onClear();
  };

  handleApplyClick = () => {
    const { tableData, setTableData } = this.props;
    const {
      choosedMerge,
      choosedJoin,
      selectedTable,
      choosedReference
    } = this.state;
    this.setState({
      isSpinnerShowed: true
    });
    setTimeout(() => {
      let dataSet = [];
      if (selectedTable === 'table 1') {
        dataSet = JSON.parse(JSON.stringify(data));
      } else dataSet = JSON.parse(JSON.stringify(data1));
      let tbData = JSON.parse(JSON.stringify(tableData));
      if (choosedMerge === 'Vertical') {
        const keys1 = Object.keys(dataSet[0]);
        const keys2 = Object.keys(tableData[0]);
        if (JSON.stringify(keys1) === JSON.stringify(keys2)) {
          tbData = tbData.concat(dataSet);
          setTableData(tbData);
        } else alert("the tables doesn't have the same columns!");
      } else if (
        choosedReference in tbData[0]
        && choosedReference in dataSet[0]
      ) {
        const finalData = [];
        if (choosedJoin === 'Full Outer Join' || choosedJoin === 'Left Join') {
          const keys = Object.keys(dataSet[0]);
          for (let i = 0; i < tbData.length; i += 1) {
            let exist = false;
            for (let j = 0; j < dataSet.length; j += 1) {
              let obj = {};
              if (
                tbData[i][choosedReference] === dataSet[j][choosedReference]
              ) {
                obj = { ...tbData[i], ...dataSet[j] };
                finalData.push(obj);
                exist = true;
                break;
              }
            }
            if (!exist) {
              const obj = tbData[i];
              keys.forEach(key => {
                if (key !== choosedReference) {
                  obj[key] = '0';
                }
              });
              finalData.push(obj);
            }
          }
        }
        if (choosedJoin === 'Full Outer Join') {
          const keys = Object.keys(tbData[0]);
          for (let i = 0; i < dataSet.length; i += 1) {
            let exist = false;
            for (let j = 0; j < tbData.length; j += 1) {
              if (
                dataSet[i][choosedReference] === tbData[j][choosedReference]
              ) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              const obj = {};
              keys.forEach(key => {
                if (key !== choosedReference) {
                  obj[key] = '0';
                }
              });
              finalData.push({
                [choosedReference]: dataSet[i][choosedReference],
                ...obj,
                ...dataSet[i]
              });
            }
          }
        }
        if (choosedJoin === 'Right Join') {
          const keys = Object.keys(tbData[0]);
          for (let i = 0; i < dataSet.length; i += 1) {
            let exist = false;
            for (let j = 0; j < tbData.length; j += 1) {
              let obj = {};
              if (
                dataSet[i][choosedReference] === tbData[j][choosedReference]
              ) {
                obj = { ...dataSet[i], ...tbData[j] };
                finalData.push(obj);
                exist = true;
                break;
              }
            }
            if (!exist) {
              const obj = {};
              keys.forEach(key => {
                if (key !== choosedReference) {
                  obj[key] = '0';
                }
              });
              finalData.push({
                [choosedReference]: dataSet[i][choosedReference],
                ...obj,
                ...dataSet[i]
              });
            }
          }
        }
        if (choosedJoin === 'Inner Join') {
          tbData.forEach(obj => {
            dataSet.forEach(obj2 => {
              if (obj[choosedReference] === obj2[choosedReference]) {
                finalData.push({ ...obj, ...obj2 });
              }
            });
          });
        }
        setTableData(finalData);
      } else {
        alert(
          "One of the tables doesn't have " + choosedReference + ' reference'
        );
      }
      this.setState({
        isSpinnerShowed: false
      });
    }, 50);
  };

  render() {
    const {
      classes, tableData, canUndo, canRedo, onUndo, onRedo
    } = this.props;
    const {
      selectedTable,
      choosedMerge,
      choosedJoin,
      choosedReference,
      isSpinnerShowed
    } = this.state;
    let keys = [];
    if (tableData[0] !== undefined) {
      keys = Object.keys(tableData[0]);
    }
    return (
      <div>
        {isSpinnerShowed ? (
          <img
            src="/images/spinner.gif"
            alt="spinner"
            className={classes.circularProgress}
          />
        ) : (
          <div />
        )}
        <div
          style={
            isSpinnerShowed ? { pointerEvents: 'none', opacity: '0.4' } : {}
          }
        >
          <div
            className={classes.divSpace}
            style={{ marginTop: 20, width: '25%' }}
          >
            <Button
              endIcon={<UndoOutlinedIcon />}
              onClick={onUndo}
              disabled={!canUndo}
              className={classes.buttonLink}
            >
              undo
            </Button>
            <Button
              endIcon={<RedoOutlinedIcon />}
              onClick={onRedo}
              disabled={!canRedo}
              className={classes.buttonLink}
            >
              redo
            </Button>
            <Button
              endIcon={<SettingsBackupRestoreOutlinedIcon />}
              onClick={this.handleRestoreClick}
              className={classes.buttonLink}
            >
              restore data
            </Button>
          </div>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            p={1}
          >
            <Box p={1}>
              <FormControl
                className={classes.formControl}
                style={{ minWidth: 200 }}
              >
                <InputLabel>Choose Table</InputLabel>
                <Select
                  name="table"
                  value={selectedTable}
                  onChange={this.handleTableChange}
                >
                  {tables.map(table => (
                    <MenuItem key={table.id} value={table.name}>
                      {table.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box p={1}>
              <FormControl
                className={classes.formControl}
                style={{ minWidth: 200 }}
              >
                <InputLabel>Merge Type</InputLabel>
                <Select
                  name="mergeType"
                  value={choosedMerge}
                  onChange={this.handleMergeTypeChange}
                >
                  {mergeTypes.map(mergeType => (
                    <MenuItem key={mergeType.id} value={mergeType.name}>
                      {mergeType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {choosedMerge === 'Horizontal' ? (
              <Box p={1}>
                <FormControl
                  className={classes.formControl}
                  style={{ minWidth: 200 }}
                >
                  <InputLabel>Join Type</InputLabel>
                  <Select
                    name="mergeType"
                    value={choosedJoin}
                    onChange={this.handleJoinTypeChange}
                  >
                    {joinTypes.map(joinType => (
                      <MenuItem key={joinType.id} value={joinType.name}>
                        {joinType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <div />
            )}
            {choosedMerge === 'Horizontal' ? (
              <Box p={1}>
                <FormControl
                  className={classes.formControl}
                  style={{ minWidth: 200 }}
                >
                  <InputLabel>Reference key</InputLabel>
                  <Select
                    name="mergeType"
                    value={choosedReference}
                    onChange={this.handleReferenceChange}
                  >
                    {keys.map(key => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <div />
            )}
            <Box p={1}>
              <Button onClick={this.handleApplyClick}>Apply</Button>
            </Box>
          </Box>
        </div>
      </div>
    );
  }
}

MergeData.propTypes = {
  classes: PropTypes.object.isRequired,
  showMergedTable: PropTypes.func.isRequired,
  handleSetData: PropTypes.func.isRequired,
  canUndo: PropTypes.bool.isRequired,
  canRedo: PropTypes.bool.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
  originalData: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  canUndo: state.get(`importedData${ownProps.id}`).past.length > 0,
  canRedo: state.get(`importedData${ownProps.id}`).future.length > 0,
  tableData: state.get(`importedData${ownProps.id}`).present.toJS().tableData,
  originalData: state.get(`importedData${ownProps.id}`).present.toJS()
    .originalData
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onUndo: bindActionCreators(() => undoData(ownProps.id), dispatch),
  onRedo: bindActionCreators(() => redoData(ownProps.id), dispatch),
  onClear: bindActionCreators(() => clearDataHistory(ownProps.id), dispatch),
  setTableData: bindActionCreators(
    tableData => setData(tableData, ownProps.id),
    dispatch
  )
});

const MergeDataMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(MergeData);
export default withStyles(styles)(MergeDataMapped);
