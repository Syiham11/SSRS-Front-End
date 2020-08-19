import React, { Component } from 'react';
import {
  TextField,
  Button,
  Grid,
  withStyles,
  Collapse,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  IconButton
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setData } from 'dan-actions/importedDataActions';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import styles from './import-jss';

const textFilters = [
  { id: 'startWith', name: 'Starts with' },
  { id: 'contain', name: 'Contain' },
  { id: 'notcontain', name: 'Not contain' },
  { id: 'endWith', name: 'Ends with' },
  { id: 'replaceAt', name: 'Replace At' },
  { id: 'upper', name: 'To upper' },
  { id: 'lower', name: 'To lower' },
  { id: 'cut', name: 'Cut' },
  { id: 'concat', name: 'Concat' },
  { id: 'trim', name: 'Trim' }
];

const numericFilters = [
  { id: '=', name: '=' },
  { id: '<', name: '<' },
  { id: '<=', name: '<=' },
  { id: '>', name: '>' },
  { id: '>=', name: '>=' },
  { id: '!=', name: '!=' }
];

const dateFilters = [
  { id: 'before', name: 'Before' },
  { id: 'after', name: 'After' },
  { id: 'in', name: 'In' },
  { id: 'except', name: 'Except' },
  { id: 'dateNow', name: 'Date Now' },
  { id: 'dayDiff', name: 'Date difference(Day)' },
  { id: 'monDiff', name: 'Date difference(Mon)' },
  { id: 'getTime', name: 'Get time' }
];

class Filter extends Component {
  state = {
    isText: false,
    isNumeric: false,
    isDate: false,
    isSpinnerShowed: false,
    id: 0,
    textFiltersList: [],
    numericFiltersList: [],
    dateFiltersList: []
  };

  handleNumericClick = () => {
    const { isNumeric } = this.state;
    this.setState({
      isNumeric: !isNumeric,
      isText: false,
      isDate: false
    });
  };

  handleTextClick = () => {
    const { isText } = this.state;
    this.setState({
      isText: !isText,
      isNumeric: false,
      isDate: false
    });
  };

  handleDateClick = () => {
    const { isDate } = this.state;
    this.setState({
      isDate: !isDate,
      isNumeric: false,
      isText: false
    });
  };

  handleTextFilterChange = (id, e) => {
    const { textFiltersList } = this.state;
    const index = textFiltersList.findIndex(fil => fil.id === id);
    const list = Object.assign([], textFiltersList);
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      attribute: list[index].attribute,
      filter: e.target.value,
      value: list[index].value
    };
    this.setState({
      textFiltersList: list
    });
  };

  handleTextColumnChange = (id, e) => {
    const { textFiltersList } = this.state;
    const index = textFiltersList.findIndex(fil => fil.id === id);
    const list = Object.assign([], textFiltersList);
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      attribute: e.target.value,
      filter: list[index].filter,
      value: list[index].value
    };
    this.setState({
      textFiltersList: list
    });
  };

  handleTextValue = (id, e) => {
    const { textFiltersList } = this.state;
    const index = textFiltersList.findIndex(fil => fil.id === id);
    const list = Object.assign([], textFiltersList);
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      attribute: list[index].attribute,
      filter: list[index].filter,
      value: e.target.value
    };
    this.setState({
      textFiltersList: list
    });
  };

  handleNumericFilterChange = (id, e) => {
    const { numericFiltersList } = this.state;
    const index = numericFiltersList.findIndex(fil => fil.id === id);
    const list = Object.assign([], numericFiltersList);
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      attribute: list[index].attribute,
      filter: e.target.value,
      value: list[index].value
    };
    this.setState({
      numericFiltersList: list
    });
  };

  handleNumericColumnChange = (id, e) => {
    const { numericFiltersList } = this.state;
    const index = numericFiltersList.findIndex(fil => fil.id === id);
    const list = Object.assign([], numericFiltersList);
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      attribute: e.target.value,
      filter: list[index].filter,
      value: list[index].value
    };
    this.setState({
      numericFiltersList: list
    });
  };

  handleNumericValue = (id, e) => {
    const { numericFiltersList } = this.state;
    const index = numericFiltersList.findIndex(fil => fil.id === id);
    const list = Object.assign([], numericFiltersList);
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      attribute: list[index].attribute,
      filter: list[index].filter,
      value: e.target.value
    };
    this.setState({
      numericFiltersList: list
    });
  };

  handleDateFilterChange = (id, e) => {
    const { dateFiltersList } = this.state;
    const index = dateFiltersList.findIndex(fil => fil.id === id);
    const list = Object.assign([], dateFiltersList);
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      attribute: list[index].attribute,
      filter: e.target.value,
      value: list[index].value
    };
    this.setState({
      dateFiltersList: list
    });
  };

  handleDateColumnChange = (id, e) => {
    const { dateFiltersList } = this.state;
    const index = dateFiltersList.findIndex(fil => fil.id === id);
    const list = Object.assign([], dateFiltersList);
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      attribute: e.target.value,
      filter: list[index].filter,
      value: list[index].value
    };
    this.setState({
      dateFiltersList: list
    });
  };

  handleDateValue = (id, value) => {
    const { dateFiltersList } = this.state;
    const index = dateFiltersList.findIndex(fil => fil.id === id);
    const list = Object.assign([], dateFiltersList);
    list[index] = {
      id: list[index].id,
      type: list[index].type,
      attribute: list[index].attribute,
      filter: list[index].filter,
      value
    };
    this.setState({
      dateFiltersList: list
    });
  };

  handleAddFilter = type => {
    const {
      textFiltersList,
      numericFiltersList,
      dateFiltersList,
      id
    } = this.state;
    switch (type) {
      case 'text':
        this.setState({
          textFiltersList: textFiltersList.concat({
            id: id + 1,
            type,
            attribute: '',
            filter: '',
            value: ''
          }),
          id: id + 1
        });
        break;
      case 'numeric':
        this.setState({
          numericFiltersList: numericFiltersList.concat({
            id: id + 1,
            type,
            attribute: '',
            filter: '',
            value: ''
          }),
          id: id + 1
        });
        break;
      case 'date':
        this.setState({
          dateFiltersList: dateFiltersList.concat({
            id: id + 1,
            type,
            attribute: '',
            filter: '',
            value: new Date()
          }),
          id: id + 1
        });
        break;
      default:
    }
  };

  handleRemoveFilter = (type, id) => {
    const { textFiltersList, numericFiltersList, dateFiltersList } = this.state;
    let list;
    switch (type) {
      case 'text':
        list = textFiltersList;
        list = list.filter(item => item.id !== id);
        this.setState(
          {
            textFiltersList: list
          },
          () => {
            this.handleApplyClick();
          }
        );
        break;
      case 'numeric':
        list = numericFiltersList;
        list = list.filter(item => item.id !== id);
        this.setState(
          {
            numericFiltersList: list
          },
          () => {
            this.handleApplyClick();
          }
        );
        break;
      case 'date':
        list = dateFiltersList;
        list = list.filter(item => item.id !== id);
        this.setState(
          {
            dateFiltersList: list
          },
          () => {
            this.handleApplyClick();
          }
        );
        break;
      default:
    }
  };

  handleApplyClick = () => {
    const { textFiltersList, numericFiltersList, dateFiltersList } = this.state;
    const { setTableData, tableData } = this.props;
    this.setState({
      isSpinnerShowed: true
    });
    setTimeout(() => {
      let data = JSON.parse(JSON.stringify(tableData));
      textFiltersList.forEach(fil => {
        const newData = [];
        console.log(data[0]);
        data.map(obj => {
          switch (fil.filter) {
            case 'Starts with':
              if (obj[fil.attribute].startsWith(fil.value)) {
                newData.push(obj);
              }
              break;
            case 'Contain':
              if (obj[fil.attribute].includes(fil.value)) {
                newData.push(obj);
              }
              break;
            case 'Not contain':
              if (!obj[fil.attribute].includes(fil.value)) {
                newData.push(obj);
              }
              break;
            case 'Ends with':
              if (obj[fil.attribute].endsWith(fil.value)) {
                newData.push(obj);
              }
              break;
            case 'Replace At':
              // eslint-disable-next-line no-case-declarations
              const param1 = fil.value.split(';');
              if (typeof obj[fil.attribute] === 'string') {
                obj[fil.attribute] = obj[fil.attribute]
                  .substring(param1[0] - 1, obj[fil.attribute].length + 1)
                  .concat(param1[1]);
              }
              newData.push(obj);
              break;
            case 'Cut':
              // eslint-disable-next-line no-case-declarations
              const param = fil.value.split(';');
              if (param[0] < param[1]) {
                obj[fil.attribute] = obj[fil.attribute]
                  .toString()
                  .substring(param[0] - 1, param[1] - 1);
              }
              newData.push(obj);
              break;
            case 'To upper':
              if (typeof obj[fil.attribute] === 'string') obj[fil.attribute] = obj[fil.attribute].toUpperCase();
              newData.push(obj);
              break;
            case 'To lower':
              if (typeof obj[fil.attribute] === 'string') obj[fil.attribute] = obj[fil.attribute].toLowerCase();
              newData.push(obj);
              break;
            case 'Concat':
              if (typeof obj[fil.attribute] === 'string') obj[fil.attribute] = obj[fil.attribute].concat(fil.value);
              newData.push(obj);
              break;
            case 'Trim':
              if (typeof obj[fil.attribute] === 'string') obj[fil.attribute] = obj[fil.attribute].trim();
              newData.push(obj);
              break;
            default:
          }
          return null;
        });
        data = newData;
      });
      numericFiltersList.forEach(fil => {
        const newData = [];
        data.map(obj => {
          const objValue = parseFloat(obj[fil.attribute]);
          const filterValue = parseFloat(fil.value);
          switch (fil.filter) {
            case '=':
              if (objValue === filterValue) {
                newData.push(obj);
              }
              break;
            case '<':
              if (objValue < filterValue) {
                newData.push(obj);
              }
              break;
            case '<=':
              if (objValue <= filterValue) {
                newData.push(obj);
              }
              break;
            case '>':
              if (objValue > filterValue) {
                newData.push(obj);
              }
              break;
            case '>=':
              if (objValue >= filterValue) {
                newData.push(obj);
              }
              break;
            case '!=':
              if (objValue !== filterValue) {
                newData.push(obj);
              }
              break;
            default:
          }
          return null;
        });
        data = newData;
      });
      dateFiltersList.forEach(fil => {
        const newData = [];
        data.map(obj => {
          const objValue = new Date(obj[fil.attribute].slice(0, 10)).getTime();
          const filterValue = new Date(
            fil.value.toISOString().slice(0, 10)
          ).getTime();
          switch (fil.filter) {
            case 'Before':
              if (objValue < filterValue) {
                newData.push(obj);
              }
              break;
            case 'In':
              if (objValue === filterValue) {
                newData.push(obj);
              }
              break;
            case 'Except':
              if (objValue !== filterValue) {
                newData.push(obj);
              }
              break;
            case 'After':
              if (objValue > filterValue) {
                newData.push(obj);
              }
              break;
            case 'Date Now':
              obj[fil.attribute] = new Date(Date.now()).toLocaleString();
              newData.push(obj);
              break;
            case 'Date difference(Day)':
              // eslint-disable-next-line no-case-declarations
              const seconds = filterValue - objValue;
              // eslint-disable-next-line no-case-declarations
              const days = Math.floor(seconds / (24 * 3600000));
              // eslint-disable-next-line no-param-reassign
              obj[fil.attribute] = days + ' day';
              newData.push(obj);
              break;
            case 'Date difference(Mon)':
              // eslint-disable-next-line no-case-declarations
              const seconds1 = filterValue - objValue;
              // eslint-disable-next-line no-case-declarations
              const days1 = Math.floor(seconds1 / (24 * 3600000));
              // eslint-disable-next-line no-case-declarations
              const months = Math.floor(days1 / 30);
              // eslint-disable-next-line no-param-reassign
              obj[fil.attribute] = months + ' Month';
              newData.push(obj);
              break;
            case 'Get time':
              obj[fil.attribute] = Date.now();
              newData.push(obj);
              break;
            default:
          }
          return null;
        });
        data = newData;
      });
      setTableData(data);
      this.setState({
        isSpinnerShowed: false,
        numericFiltersList: [],
        textFiltersList: [],
        dateFiltersList: []
      });
    }, 200);
  };

  render() {
    const {
      isText,
      isNumeric,
      isDate,
      textFiltersList,
      numericFiltersList,
      dateFiltersList,
      isSpinnerShowed
    } = this.state;
    const { classes, tableData } = this.props;
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
          <div className={classes.divCenter}>
            <Button
              endIcon={
                isNumeric ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              className={
                isNumeric ? classes.buttonMenuSelected : classes.buttonMenu
              }
              onClick={this.handleNumericClick}
            >
              Numeric
            </Button>
            <Button
              endIcon={
                isText ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />
              }
              className={
                isText ? classes.buttonMenuSelected : classes.buttonMenu
              }
              onClick={this.handleTextClick}
            >
              Text
            </Button>
            <Button
              endIcon={
                isDate ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />
              }
              className={
                isDate ? classes.buttonMenuSelected : classes.buttonMenu
              }
              onClick={this.handleDateClick}
            >
              Date
            </Button>
          </div>
          <Collapse in={isText}>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="center"
            >
              {textFiltersList.map(row => (
                <Grid item xs={12} md={8}>
                  <div className={classes.divSpace}>
                    <FormControl
                      className={classes.formControl}
                      style={{ minWidth: '25%' }}
                    >
                      <InputLabel>Choose column</InputLabel>
                      <Select
                        name="attributeName"
                        value={row.attribute}
                        onChange={e => this.handleTextColumnChange(row.id, e)}
                      >
                        {keys.map(key => (
                          <MenuItem key={key} value={key}>
                            {key}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      style={{ minWidth: '25%' }}
                    >
                      <InputLabel>Choose filter</InputLabel>
                      <Select
                        name="textFilter"
                        value={row.filter}
                        onChange={e => this.handleTextFilterChange(row.id, e)}
                      >
                        {textFilters.map(filter => (
                          <MenuItem key={filter.id} value={filter.name}>
                            {filter.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      id="outlined-basic"
                      label="Insert value seperated by ;"
                      variant="outlined"
                      style={{ minWidth: '25%' }}
                      value={row.value}
                      onChange={e => this.handleTextValue(row.id, e)}
                      className={classes.textField}
                    />
                    <IconButton
                      aria-label="Remove"
                      className={classes.margin}
                      onClick={() => this.handleRemoveFilter(row.type, row.id)}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
              <Grid item xs={12} md={8}>
                <div className={classes.divCenter}>
                  <IconButton
                    aria-label="Add"
                    className={classes.margin}
                    onClick={() => this.handleAddFilter('text')}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </div>
                {textFiltersList.length > 0 ? (
                  <div className={classes.divCenter}>
                    <Button
                      className={classes.button}
                      onClick={this.handleApplyClick}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div />
                )}
              </Grid>
            </Grid>
          </Collapse>
          <Collapse in={isNumeric}>
            <Grid
              container
              spacing={3}
              direction="row"
              justify="center"
              alignItems="center"
            >
              {numericFiltersList.map(row => (
                <Grid item xs={12} md={8}>
                  <div className={classes.divSpace}>
                    <FormControl
                      className={classes.formControl}
                      style={{ minWidth: '25%' }}
                    >
                      <InputLabel>Choose column</InputLabel>
                      <Select
                        name="attributeName"
                        value={row.attribute}
                        onChange={e => this.handleNumericColumnChange(row.id, e)
                        }
                      >
                        {keys.map(key => (
                          <MenuItem key={key} value={key}>
                            {key}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      style={{ minWidth: '25%' }}
                    >
                      <InputLabel>Choose filter</InputLabel>
                      <Select
                        name="numericFilter"
                        value={row.filter}
                        onChange={e => this.handleNumericFilterChange(row.id, e)
                        }
                      >
                        {numericFilters.map(filter => (
                          <MenuItem key={filter.id} value={filter.name}>
                            {filter.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      id="outlined-basic"
                      label="Insert value"
                      variant="outlined"
                      value={row.value}
                      style={{ minWidth: '25%' }}
                      onChange={e => this.handleNumericValue(row.id, e)}
                      className={classes.textField}
                    />
                    <IconButton
                      aria-label="Remove"
                      className={classes.margin}
                      onClick={() => this.handleRemoveFilter(row.type, row.id)}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
              <Grid item xs={12} md={8}>
                <div className={classes.divCenter}>
                  <IconButton
                    aria-label="Add"
                    className={classes.margin}
                    onClick={() => this.handleAddFilter('numeric')}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </div>
                {numericFiltersList.length > 0 ? (
                  <div className={classes.divCenter}>
                    <Button
                      className={classes.button}
                      onClick={this.handleApplyClick}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div />
                )}
              </Grid>
            </Grid>
          </Collapse>

          <Collapse in={isDate}>
            <Grid
              container
              spacing={3}
              direction="row"
              justify="center"
              alignItems="center"
            >
              {dateFiltersList.map(row => (
                <Grid item xs={12} md={8}>
                  <div className={classes.divSpace}>
                    <FormControl
                      className={classes.formControl}
                      style={{ minWidth: '25%' }}
                    >
                      <InputLabel>Choose column</InputLabel>
                      <Select
                        name="attributeName"
                        value={row.attribute}
                        onChange={e => this.handleDateColumnChange(row.id, e)}
                      >
                        {keys.map(key => (
                          <MenuItem key={key} value={key}>
                            {key}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      style={{ minWidth: '25%' }}
                    >
                      <InputLabel>Choose filter</InputLabel>
                      <Select
                        name="dateFilter"
                        value={row.filter}
                        onChange={e => this.handleDateFilterChange(row.id, e)}
                      >
                        {dateFilters.map(filter => (
                          <MenuItem key={filter.id} value={filter.name}>
                            {filter.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Choose date"
                        value={row.value}
                        onChange={value => this.handleDateValue(row.id, value)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date'
                        }}
                        style={{ minWidth: '25%', margin: '0' }}
                      />
                    </MuiPickersUtilsProvider>
                    <IconButton
                      aria-label="Remove"
                      className={classes.margin}
                      onClick={() => this.handleRemoveFilter(row.type, row.id)}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
              <Grid item xs={12} md={8}>
                <div className={classes.divCenter}>
                  <IconButton
                    aria-label="Add"
                    className={classes.margin}
                    onClick={() => this.handleAddFilter('date')}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </div>
                {dateFiltersList.length > 0 ? (
                  <div className={classes.divCenter}>
                    <Button
                      className={classes.button}
                      onClick={this.handleApplyClick}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div />
                )}
              </Grid>
            </Grid>
          </Collapse>
        </div>
      </div>
    );
  }
}

Filter.propTypes = {
  classes: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  setTableData: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  tableData: state.get(`importedData${ownProps.id}`).present.toJS().tableData
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setTableData: bindActionCreators(data => setData(data, ownProps.id), dispatch)
});

const FilterMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);

export default withStyles(styles)(FilterMapped);
