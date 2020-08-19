import React, { Component } from 'react';
import MathJax from 'react-mathjax2';
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
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  IconButton,
  Radio
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Ionicon from 'react-ionicons';
import * as math from 'mathjs';
import Axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setData } from 'dan-actions/importedDataActions';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined';
import statistics from './formulas';
import styles from './import-jss';

const functionTypes = [
  { id: 'Linear', name: 'Linear' },
  { id: 'Derivation', name: 'Derivation' },
  { id: 'Integration', name: 'Integration' },
  { id: 'Boolean', name: 'Boolean' }
];

const apiURL = 'http://localhost:9090/formula';

class Calcul extends Component {
  state = {
    isChooseFunction: false,
    isCreateFunction: false,
    equation: '',
    selectedFunctionType: '',
    inputs: [],
    selectedFunction: '',
    selectedColumn: '',
    newColumnName: '',
    openFunctionsList: false,
    openSave: false,
    openSavedFormulas: false,
    isSpinnerShowed: false,
    historyFormulas: [],
    formulaName: '',
    radioChoosedIndex: -1
  };

  handleChooseFunctionClick = () => {
    const { isChooseFunction } = this.state;
    this.setState({
      isChooseFunction: !isChooseFunction,
      isCreateFunction: false
    });
  };

  handleCreateFunctionClick = () => {
    const { isCreateFunction } = this.state;
    this.setState({
      isCreateFunction: !isCreateFunction,
      isChooseFunction: false
    });
  };

  handleFunctionTypeChange = event => {
    this.setState({
      selectedFunctionType: event.target.value
    });
  };

  handleFunctionChange = event => {
    this.setState({
      selectedFunction: event.target.value
    });
  };

  handleInlineText = () => {
    const { selectedFunctionType, equation } = this.state;
    if (selectedFunctionType === 'Derivation') {
      return '( ' + equation + ")'";
    }
    if (selectedFunctionType === 'Integration') {
      return 'int ' + equation;
    }
    if (selectedFunctionType === 'Boolean ') {
      return 'bool ( ' + equation + ')';
    }
    return equation;
  };

  handleEquationText = event => {
    this.setState({
      equation: event.target.value
    });
  };

  handleNumVariablesText = event => {
    let i = 0;
    let list = [];
    while (i < event.target.value) {
      list = list.concat({
        id: i,
        variable: '',
        column: ''
      });
      i += 1;
    }
    this.setState({
      inputs: list
    });
  };

  handleNewColumnName = event => {
    this.setState({
      newColumnName: event.target.value
    });
  };

  handleVariableChange = (id, e) => {
    const { inputs } = this.state;
    const index = inputs.findIndex(fil => fil.id === id);
    const list = Object.assign([], inputs);
    list[index] = {
      id: list[index].id,
      variable: e.target.value,
      column: list[index].column
    };
    this.setState({
      inputs: list
    });
  };

  handleFunctionColumnChange = (id, e) => {
    const { inputs } = this.state;
    const index = inputs.findIndex(fil => fil.id === id);
    const list = Object.assign([], inputs);
    list[index] = {
      id: list[index].id,
      variable: list[index].variable,
      column: e.target.value
    };
    this.setState({
      inputs: list
    });
  };

  handleColumnNameChange = event => {
    this.setState({
      selectedColumn: event.target.value
    });
  };

  solveEquation = () => {
    const { equation, selectedFunctionType } = this.state;
    let result = equation;
    if (selectedFunctionType === 'Derivation') {
      result = math.derivative(equation, 'x');
    }
    if (selectedFunctionType === 'Integration') {
      const mathjs = math.create(math.all);
      mathjs.import(require('mathjs-simple-integral'));
      result = mathjs.integral(equation, 'x');
    }
    result = math.simplify(result.toString());
    return result;
  };

  handleCalculClick = () => {
    const { inputs, newColumnName } = this.state;
    const { tableData, setTableData } = this.props;
    const result = this.solveEquation().toString();
    const elem = [result, inputs, newColumnName, tableData];
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.post(apiURL + '/solve', elem, config).then(response => {
      setTableData(response.data);
    });
  };

  showInformations = () => {
    this.setState({
      openFunctionsList: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      openFunctionsList: false,
      openSave: false,
      openSavedFormulas: false
    });
  };

  handleSaveDialogOpen = () => {
    this.setState({
      openSave: true
    });
  };

  handleformulaName = event => {
    this.setState({
      formulaName: event.target.value
    });
  };

  handleRadioChoose = event => {
    this.setState({
      radioChoosedIndex: event.target.value
    });
  };

  handleHistoryFormulaOk = () => {
    const { historyFormulas, radioChoosedIndex } = this.state;
    this.setState({
      equation: historyFormulas[radioChoosedIndex].equation,
      selectedFunctionType: historyFormulas[radioChoosedIndex].type
    });
    this.handleDialogClose();
  };

  handleSave = () => {
    const { formulaName, selectedFunctionType, equation } = this.state;
    const elem = {
      userId: 1,
      name: formulaName,
      equation,
      type: selectedFunctionType,
      creationTime: new Date()
    };
    const { sub } = JSON.parse(sessionStorage.getItem('user'));
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.post(apiURL + '/insert&' + sub, elem, config);
    this.handleDialogClose();
  };

  handleLoad = () => {
    const { sub } = JSON.parse(sessionStorage.getItem('user'));
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.get(apiURL + '/getAll&' + sub, config).then(response => {
      this.setState({
        historyFormulas: response.data,
        openSavedFormulas: true
      });
    });
  };

  handleDeleteFormula = formula => {
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.post(apiURL + '/delete', formula, config).then(response => {
      console.log(response.data);
      this.updateFormulaHistory();
    });
  };

  updateFormulaHistory = () => {
    const { sub } = JSON.parse(sessionStorage.getItem('user'));
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.get(apiURL + '/getAll&' + sub, config).then(response => {
      this.setState({
        historyFormulas: response.data
      });
    });
  };

  render() {
    const {
      isCreateFunction,
      isChooseFunction,
      selectedFunctionType,
      selectedFunction,
      inputs,
      selectedColumn,
      openFunctionsList,
      openSave,
      openSavedFormulas,
      isSpinnerShowed,
      historyFormulas,
      equation
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
            {/* <Button
              endIcon={
                isChooseFunction ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              className={
                isChooseFunction
                  ? classes.buttonMenuSelected
                  : classes.buttonMenu
              }
              onClick={this.handleChooseFunctionClick}
            >
              Choose function
            </Button> */}
            <Button
              endIcon={
                isCreateFunction ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              className={
                isCreateFunction
                  ? classes.buttonMenuSelected
                  : classes.buttonMenu
              }
              onClick={this.handleCreateFunctionClick}
            >
              Create function
            </Button>
          </div>
          <Collapse in={isCreateFunction}>
            <Grid
              container
              spacing={3}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} md={10}>
                <div className={classes.divCenter}>
                  <Typography
                    variant="caption"
                    className={classes.subtitle}
                    gutterBottom
                    align="center"
                  >
                    Use parameters below to create your own formula, make sure
                    that you fill the blanks with right values.
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={9}>
                <div className={classes.btnArea}>
                  <FormControl
                    className={classes.formControl}
                    style={{ minWidth: '20%' }}
                  >
                    <InputLabel>Choose function type</InputLabel>
                    <Select
                      name="functionType"
                      value={selectedFunctionType}
                      onChange={this.handleFunctionTypeChange}
                    >
                      {functionTypes.map(functionType => (
                        <MenuItem
                          key={functionType.id}
                          value={functionType.name}
                        >
                          {functionType.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    id="outlined-basic"
                    label="Insert equation"
                    variant="outlined"
                    style={{ minWidth: '20%' }}
                    value={equation}
                    onChange={this.handleEquationText}
                    className={classes.textField}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Number of variables"
                    variant="outlined"
                    style={{ minWidth: '20%' }}
                    onChange={this.handleNumVariablesText}
                    className={classes.textField}
                  />
                  <TextField
                    id="outlined-basic"
                    label="New column name"
                    variant="outlined"
                    style={{ minWidth: '20%' }}
                    onChange={this.handleNewColumnName}
                    className={classes.textField}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={10}>
                <MathJax.Context input="ascii">
                  <div className={classes.divCenter}>
                    Your formula:
                    {' '}
                    <MathJax.Node inline>
                      {this.handleInlineText()}
                    </MathJax.Node>
                  </div>
                </MathJax.Context>
              </Grid>
              <Grid item xs={12} md={4}>
                {inputs.map(input => (
                  <div className={classes.divCenter}>
                    <Grid
                      container
                      spacing={4}
                      alignItems="center"
                      justify="center"
                    >
                      <Grid item xs={6}>
                        <TextField
                          id="outlined-basic"
                          label="Set variable"
                          variant="outlined"
                          value={input.variable}
                          onChange={e => this.handleVariableChange(input.id, e)}
                          fullWidth
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl className={classes.formControl} fullWidth>
                          <InputLabel>Choose column</InputLabel>
                          <Select
                            name="attributeName"
                            value={input.column}
                            onChange={e => this.handleFunctionColumnChange(input.id, e)
                            }
                          >
                            {keys.map(key => (
                              <MenuItem key={key} value={key}>
                                {key}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </Grid>
            </Grid>
            <div className={classes.divCenter} style={{ marginTop: 20 }}>
              <Button className={classes.button} onClick={this.handleLoad}>
                Load
              </Button>
              <Button
                className={classes.button}
                onClick={this.handleSaveDialogOpen}
              >
                Save
              </Button>
              <Button
                onClick={this.handleCalculClick}
                className={classes.button}
              >
                Apply
              </Button>
            </div>
          </Collapse>
          <Collapse in={isChooseFunction}>
            <Grid
              container
              spacing={3}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} md={10}>
                <div className={classes.divCenter}>
                  <Typography
                    variant="caption"
                    className={classes.subtitle}
                    gutterBottom
                    align="center"
                  >
                    Choose a function to apply it on a column of the table.
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={10}>
                <div className={classes.divCenter}>
                  <FormControl
                    className={classes.formControl}
                    style={{ minWidth: '25%' }}
                  >
                    <InputLabel>Choose function</InputLabel>
                    <Select
                      name="function"
                      value={selectedFunction}
                      onChange={this.handleFunctionChange}
                    >
                      {statistics.map(statistic => (
                        <MenuItem key={statistic.name} value={statistic.desc}>
                          {statistic.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={this.showInformations}>
                    <Ionicon icon="ios-information-circle-outline" />
                  </IconButton>
                  <FormControl
                    className={classes.formControl}
                    style={{ minWidth: '25%' }}
                  >
                    <InputLabel>Choose column</InputLabel>
                    <Select
                      name="columnName"
                      value={selectedColumn}
                      onChange={this.handleColumnNameChange}
                    >
                      {keys.map(key => (
                        <MenuItem key={key} value={key}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
            <div className={classes.divCenter}>
              <IconButton aria-label="done" className={classes.margin}>
                <DoneOutlinedIcon />
              </IconButton>
            </div>
          </Collapse>
          <Dialog
            maxWidth="lg"
            aria-labelledby="functionsDesctiption"
            open={openFunctionsList}
            onClose={this.handleDialogClose}
            classes={{
              paper: classes.paper
            }}
          >
            <DialogTitle id="functionsDesctiption">Functions</DialogTitle>
            <DialogContent>
              <Table aria-label="Functions">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statistics.map(row => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="SaveFormula"
            open={openSave}
            classes={{
              paper: classes.paper
            }}
          >
            <DialogTitle id="SaveFormula">Save Formula</DialogTitle>
            <DialogContent>
              <TextField
                id="outlined-basic"
                label="Insert Name"
                variant="outlined"
                fullWidth
                onChange={this.handleformulaName}
                className={classes.textField}
              />
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.handleDialogClose}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={this.handleSave} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            maxWidth="lg"
            aria-labelledby="History Formulas"
            open={openSavedFormulas}
            onClose={this.handleDialogClose}
            classes={{
              paper: classes.paper
            }}
          >
            <DialogTitle id="historyFormulas">Choose Formula</DialogTitle>
            <DialogContent>
              <Table aria-label="Formulas">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">Type</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyFormulas.map((row, index) => (
                    <TableRow key={row.name}>
                      <TableCell align="center" scope="row">
                        <Radio
                          value={index}
                          name="radio-button-demo"
                          onChange={this.handleRadioChoose}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.equation}</TableCell>
                      <TableCell align="left">{row.type}</TableCell>
                      <TableCell align="left">
                        <IconButton
                          aria-label="delete"
                          onClick={() => this.handleDeleteFormula(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.handleDialogClose}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={this.handleHistoryFormulaOk} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

Calcul.propTypes = {
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

const CalculMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Calcul);

export default withStyles(styles)(CalculMapped);
