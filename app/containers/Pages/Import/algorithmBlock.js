import React from 'react';
import 'nerdamer/Algebra.js';
import 'nerdamer/Calculus.js';
import 'nerdamer/Solve.js';
import * as nerdamer from 'nerdamer';
import {
  Avatar,
  Button,
  Chip,
  Divider,
  FormControl,
  withStyles,
  Grid,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Dialog,
  DialogContent,
  DialogContentText,
  Typography,
  DialogTitle,
  DialogActions,
} from '@material-ui/core';
import { PropTypes } from 'prop-types';
import _ from 'lodash';
import MathJax from 'react-mathjax2';
import AddIcon from '@material-ui/icons/Add';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import AlgorithmsServices from '../../Services/algorithm';
import styles from './import-jss';

class AlgorithmBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAlgorithm: {
        algo: {
          algoId: ''
        },
        variables: [],
        result: ''
      },
      algorithms: [],
      open: false,
      algorithmType: '',
      newAlgo: {
        name: '',
        formula: '',
        desc: '',
        numberOfDerivative: 1,
        parameter: ''
      },
    };
  }

  componentDidMount() {
    AlgorithmsServices.getAllAlgorithms().then(result => {
      this.setState({ algorithms: result.data });
    });
  }

  handleApply = () => {
    const { currentAlgorithm } = this.state;
    const { applyFunction } = this.props;
    applyFunction({ currentAlgorithm });
  };

  handleSave = () => {
    const algo = {
      algoType: '',
      algoDescription: '',
      algoName: '',
      algoFormula: '',
    };
    const {
      newAlgo: {
        formula,
        name,
        desc,
        numberOfDerivative,
        parameter
      },
      algorithmType
    } = this.state;
    algo.algoType = algorithmType;
    algo.algoDescription = desc;
    algo.algoName = name;
    algo.algoFormula = formula;
    if (algorithmType === 'derivative') {
      algo.algoDescription = `${desc}  ${formula} : derivative ${numberOfDerivative} times by ${parameter}`;
      const formulaChecked = nerdamer(
        `diff(${formula}, ${parameter}, ${
          numberOfDerivative
        })`
      );
      algo.algoFormula = formulaChecked.toString();
    }
    AlgorithmsServices.saveAlgorithm(algo).then(alg => {
      console.log(alg.data);
      AlgorithmsServices.getAllAlgorithms().then(result => {
        this.setState({
          algorithms: result.data,
          newAlgo: {
            name: '',
            formula: '',
            desc: ''
          }
        });
      });
    });
    this.handleClose();
  };

  handleVariableChange = v => ev => {
    const { currentAlgorithm } = this.state;
    const variable = v;
    variable.value = ev.target.value;
    const variablesT = [
      ...currentAlgorithm.variables.filter(vy => vy.name !== variable.name),
      variable
    ];
    currentAlgorithm.variables = _.sortBy(variablesT, ['name']);
    this.setState({ currentAlgorithm });
  };

  handleOpenForm = () => {
    const { open } = this.state;
    this.setState({ open: true });
    console.log(open);
  };

  handleAlgorithmTypeChange = ev => {
    this.setState({ algorithmType: ev.target.value });
  };

  handleClose = () => {
    this.setState({ open: false, algorithmType: '' });
  };

  handleNewAlgoChange = ev => {
    const { newAlgo } = this.state;
    newAlgo[ev.target.name] = ev.target.value;
    this.setState({ newAlgo });
  };

  handleAlgoChange = ev => {
    const { currentAlgorithm } = this.state;
    const currentAlgorithmT = currentAlgorithm;
    currentAlgorithmT.algo = ev.target.value;
    console.log(currentAlgorithmT);
    if (currentAlgorithmT.algo.algoType === 'integrate') {
      currentAlgorithmT.variables = [{ name: 'from', value: '' }, { name: 'to', value: '' }];
    } else {
      const t = />=|<=|=|>|</g;
      const formula = ev.target.value.algoFormula.replace(t, '+');
      currentAlgorithmT.variables = _.reduce(
        nerdamer(formula).variables(),
        (result, n) => {
          result.push({ name: n, value: '' });
          return result;
        },
        []
      );
    }
    this.setState({ currentAlgorithm: currentAlgorithmT });
  };

  handleResult = ev => {
    const { currentAlgorithm } = this.state;
    currentAlgorithm.result = ev.target.value;
    this.setState({ currentAlgorithm });
  };

  render() {
    const { classes, columns } = this.props;
    const {
      currentAlgorithm,
      algorithms,
      open,
      algorithmType,
      newAlgo: {
        name,
        formula,
        desc,
        numberOfDerivative,
        parameter,
      }
    } = this.state;
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item md={3}>
            <ListItem>
              <Chip
                label="Algorithms"
                avatar={<Avatar>A</Avatar>}
                color="primary"
              />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Algorithm</InputLabel>
                <Select
                  name="name"
                  value={
                    currentAlgorithm.algo.algoId ? currentAlgorithm.algo : ''
                  }
                  onChange={this.handleAlgoChange}
                >
                  {algorithms.map(algorithm => (
                    <MenuItem key={algorithm.algoName} value={algorithm}>
                      {algorithm.algoName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
            <ListItem>
              <MathJax.Context input="ascii">
                <div className={classes.divCenter}>
                  Your formula:
                  {' '}
                  <MathJax.Node inline>
                    {currentAlgorithm.algo.algoFormula
                      ? currentAlgorithm.algo.algoFormula
                      : ''}
                  </MathJax.Node>
                </div>
              </MathJax.Context>
            </ListItem>
            <ListItem>
              <div className={classes.divCenter}>
                Algorithm Type:
                {currentAlgorithm.algo.algoType ? currentAlgorithm.algo.algoType : '' }
              </div>
            </ListItem>
          </Grid>
          <Grid item md={3}>
            <ListItem>
              <Chip
                label="Result"
                avatar={<Avatar>R</Avatar>}
                color="primary"
              />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <FormControl variant="standard" fullWidth>
                <TextField
                  id="standard-basic"
                  label="new column name"
                  variant="standard"
                  value={currentAlgorithm.result}
                  onChange={this.handleResult}
                />
              </FormControl>
            </ListItem>
          </Grid>
          <Grid item md={3}>
            <ListItem>
              <Chip
                label="Parameters"
                avatar={<Avatar>P</Avatar>}
                color="primary"
              />
            </ListItem>
            <Divider variant="middle" />
            {
              currentAlgorithm.variables.map(v => (
                <ListItem key={v.name}>
                  <FormControl fullWidth>
                    <InputLabel>{v.name}</InputLabel>
                    <Select
                      value={v.value || ''}
                      onChange={this.handleVariableChange(v)}
                    >
                      {columns.map(col => (
                        <MenuItem key={col} value={col}>
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListItem>
              ))
            }
          </Grid>
          <Grid item md={3}>
            <ListItem>
              <Chip
                label="Actions"
                avatar={<Avatar>A</Avatar>}
                color="primary"
              />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <Button
                className={classes.buttonAlgo}
                size="small"
                variant="contained"
                color="secondary"
                startIcon={<DoneAllIcon />}
                disabled={
                  !currentAlgorithm.algo.algoId && !currentAlgorithm.result
                }
                onClick={this.handleApply}
              >
                Apply
              </Button>
              <Tooltip title="Create new algorithm">
                <Button
                  size="small"
                  variant="contained"
                  className={classes.buttonAlgo}
                  startIcon={<AddIcon />}
                  onClick={this.handleOpenForm}
                >
                  Create
                </Button>
              </Tooltip>
            </ListItem>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          disableBackdropClick
          disableEscapeKeyDown
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="alert-dialog-title">Create Algorithm</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography
                variant="caption"
                className={classes.subtitle}
                gutterBottom
                align="center"
              >
                Use parameters below to create your own formula, make sure that
                you fill the blanks with right values.
              </Typography>
              <ListItem>
                <FormControl fullWidth className={classes.formControlAlgo}>
                  <InputLabel>Select algorithm type</InputLabel>
                  <Select
                    name="algorithmType"
                    value={algorithmType || ''}
                    onChange={this.handleAlgorithmTypeChange}
                  >
                    {['simple', 'derivative', 'integrate', 'boolean'].map(
                      type => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </ListItem>
              {algorithmType === 'derivative' ? (
                <div>
                  <ListItem>
                    <TextField
                      id="standard-basic"
                      label="name"
                      variant="standard"
                      value={name}
                      name="name"
                      className={classes.formControlAlgo}
                      style={{ width: '50%' }}
                      onChange={this.handleNewAlgoChange}
                    />
                    <TextField
                      label="Formula"
                      variant="standard"
                      name="formula"
                      value={formula}
                      className={classes.formControlAlgo}
                      style={{ width: '50%' }}
                      onChange={this.handleNewAlgoChange}
                    />
                  </ListItem>
                  <ListItem>
                    <TextField
                      label="number of derivative"
                      variant="standard"
                      name="numberOfDerivative"
                      value={numberOfDerivative}
                      type="number"
                      className={classes.formControlAlgo}
                      style={{ width: '50%' }}
                      onChange={this.handleNewAlgoChange}
                    />
                    <TextField
                      label="variable"
                      variant="standard"
                      name="parameter"
                      value={parameter}
                      className={classes.formControlAlgo}
                      style={{ width: '50%' }}
                      onChange={this.handleNewAlgoChange}
                    />
                  </ListItem>
                  <ListItem>
                    <TextField
                      id="standard-basic"
                      label="Description"
                      variant="standard"
                      multiline
                      rows={4}
                      value={desc}
                      name="desc"
                      fullWidth
                      className={classes.formControlAlgo}
                      onChange={this.handleNewAlgoChange}
                    />
                  </ListItem>
                  <ListItem className={classes.formControlAlgo}>
                    <MathJax.Context input="ascii">
                      <div>
                        <h6>Your Formula</h6>
                        <MathJax.Node inline>{formula}</MathJax.Node>
                      </div>
                    </MathJax.Context>
                  </ListItem>
                </div>
              ) : algorithmType === 'simple' || algorithmType === 'integrate' || algorithmType === 'boolean' ? (
                <div>
                  <ListItem>
                    <TextField
                      id="standard-basic"
                      label="name"
                      variant="standard"
                      value={name}
                      name="name"
                      className={classes.formControlAlgo}
                      style={{ width: '50%' }}
                      onChange={this.handleNewAlgoChange}
                    />
                    <TextField
                      label="Formula"
                      variant="standard"
                      name="formula"
                      value={formula}
                      className={classes.formControlAlgo}
                      style={{ width: '50%' }}
                      onChange={this.handleNewAlgoChange}
                    />
                  </ListItem>
                  <ListItem>
                    <TextField
                      id="standard-basic"
                      label="Description"
                      variant="standard"
                      multiline
                      rows={4}
                      value={desc}
                      name="desc"
                      fullWidth
                      className={classes.formControlAlgo}
                      onChange={this.handleNewAlgoChange}
                    />
                  </ListItem>
                  <ListItem className={classes.formControlAlgo}>
                    <MathJax.Context input="ascii">
                      <div>
                        <h6>Your Formula</h6>
                        <MathJax.Node inline>{formula}</MathJax.Node>
                      </div>
                    </MathJax.Context>
                  </ListItem>
                </div>
              ) : (
                <div />
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={algorithmType === ''}
              onClick={this.handleSave}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
AlgorithmBlock.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  applyFunction: PropTypes.func.isRequired
};

export default withStyles(styles)(AlgorithmBlock);
