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
  Box,
  Typography,
  IconButton, Collapse, Icon
} from '@material-ui/core';
import { PropTypes } from 'prop-types';
import _ from 'lodash';
import MathJax from 'react-mathjax2';
import AddIcon from '@material-ui/icons/Add';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CloseIcon from '@material-ui/icons/Close';
import AlgorithmsServices from '../../Services/algorithm';
import styles from './import-jss';
import history from '../../../utils/history';
import Transition from './transition';


class AlgorithmBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAlgorithm: {
        algo: {
          algoId: ''
        },
        variables: [],
        result: '',
      },
      algorithms: [],
      open: false,
      algorithmType: '',
      newAlgo: {
        name: '',
        formula: '',
        desc: '',
      }
    };
  }

  componentDidMount() {
    AlgorithmsServices.getAllAlgorithms().then(result => {
      this.setState({ algorithms: result.data });
    });
  }

  handleApply = () => {
    const { currentAlgorithm } = this.state;
    console.log(currentAlgorithm);
    const { applyFunction } = this.props;
    applyFunction({ currentAlgorithm });
  };

  handleSave = () => {
    const algo = {
      algoType: '',
      algoDescription: '',
      algoName: '',
      algoFormula: '',
      from: 0,
      to: 0,
      sign: '',
      expression: ''
    };
    const { newAlgo: { formula, name, desc } } = this.state;
    algo.algoType = 'simple';
    algo.algoDescription = desc;
    algo.algoName = name;
    algo.algoFormula = formula;
    AlgorithmsServices.saveAlgorithm(algo).then(alg => {
      console.log(alg.data);
      AlgorithmsServices.getAllAlgorithms().then(result => {
        this.setState({
          algorithms: result.data,
          newAlgo: {
            name: '',
            formula: '',
            desc: '',
          }
        });
      });
    });
    this.handleClose();
  };

  handleVariableChange = (v) => (ev) => {
    const { currentAlgorithm } = this.state;
    const variable = v;
    variable.value = ev.target.value;
    const variablesT = [...currentAlgorithm.variables.filter((vy) => vy.name !== variable.name), variable];
    currentAlgorithm.variables = _.sortBy(variablesT, ['name']);
    this.setState({ currentAlgorithm });
  };

  handleGoToAlgo = () => {
    history.push('/app/algorithms');
  };

  handleOpenForm = () => {
    const { open } = this.state;
    this.setState({ open: true });
    console.log(open);
  }

  handleAlgorithmTypeChange = (ev) => {
    this.setState({ algorithmType: ev.target.value });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleNewAlgoChange = (ev) => {
    const { newAlgo } = this.state;
    newAlgo[ev.target.name] = ev.target.value;
    this.setState({ newAlgo });
  }

  handleAlgoChange = (ev) => {
    const { currentAlgorithm } = this.state;
    const currentAlgorithmT = currentAlgorithm;
    currentAlgorithmT.algo = ev.target.value;
    const t = />=|<=|=|>|</g;
    const formula = ev.target.value.algoFormula.replace(t, '+');
    currentAlgorithmT.variables = _.reduce(nerdamer(formula).variables(), (result, n) => {
      result.push({ name: n, value: '' });
      return result;
    }, []);
    this.setState({ currentAlgorithm: currentAlgorithmT });
  };

  handleResult = (ev) => {
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
      }
    } = this.state;
    return (
      <div>
        <Grid
          container
          spacing={3}
        >
          <Grid item md={3}>
            <ListItem>
              <Chip label="Algorithms" avatar={<Avatar>A</Avatar>} color="primary" />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <FormControl
                fullWidth
              >
                <InputLabel>
                  Algorithms
                </InputLabel>
                <Select
                  name="name"
                  value={currentAlgorithm.algo || ''}
                  onChange={this.handleAlgoChange}
                >

                  {algorithms.map((algorithm) => (
                    <MenuItem
                      key={algorithm.algoName}
                      value={algorithm}
                    >
                      {algorithm.algoName}
                    </MenuItem>
                  ))
                  }
                </Select>
              </FormControl>
            </ListItem>
            <ListItem>
              <MathJax.Context input="ascii">
                <div className={classes.divCenter}>
                  Your formula:
                  {' '}
                  <MathJax.Node inline>
                    {
                      currentAlgorithm.algo.algoFormula ? currentAlgorithm.algo.algoFormula : ''
                    }
                  </MathJax.Node>
                </div>
              </MathJax.Context>
            </ListItem>
          </Grid>
          <Grid item md={3}>
            <ListItem>
              <Chip label="Result" avatar={<Avatar>R</Avatar>} color="primary" />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <FormControl
                variant="standard"
                fullWidth
              >
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
              <Chip label="Parameters" avatar={<Avatar>P</Avatar>} color="primary" />
            </ListItem>
            <Divider variant="middle" />
            {
              currentAlgorithm.variables.map((v) => (
                <ListItem key={v.name}>
                  <FormControl
                    fullWidth
                  >
                    <InputLabel>
                      {v.name}
                    </InputLabel>
                    <Select
                      value={v.value || ''}
                      onChange={this.handleVariableChange(v)}
                    >
                      {columns.map((col) => (
                        <MenuItem
                          key={col}
                          value={col}
                        >
                          {col}
                        </MenuItem>
                      ))
                      }
                    </Select>
                  </FormControl>
                </ListItem>
              ))
            }
          </Grid>
          <Grid item md={3}>
            <ListItem>
              <Chip label="Actions" avatar={<Avatar>A</Avatar>} color="primary" />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <Button
                className={classes.buttonAlgo}
                size="small"
                variant="contained"
                color="secondary"
                startIcon={<DoneAllIcon />}
                disabled={!currentAlgorithm.algo.algoId && !currentAlgorithm.result}
                onClick={this.handleApply}
              >
                Apply
              </Button>
              <Tooltip title="hit to create new algorithm">
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
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="sm"
        >
          <Box display="flex" component={ListItem}>
            <Box flexGrow={1}>
              <Typography variant="subtitle2" color="primary">
                Create algorithm
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography
                variant="caption"
                className={classes.subtitle}
                gutterBottom
                align="center"
              >
                Use parameters below to create your own formula, make sure
                that you fill the blanks with right values.
              </Typography>
              <ListItem>
                <FormControl
                  fullWidth
                  className={classes.formControlAlgo}
                >
                  <InputLabel>
                    Select algorithm type
                  </InputLabel>
                  <Select
                    name="algorithmType"
                    value={algorithmType || ''}
                    onChange={this.handleAlgorithmTypeChange}
                  >

                    {['simple', 'derivative', 'integrate', 'boolean'].map((type) => (
                      <MenuItem
                        key={type}
                        value={type}
                      >
                        {type}
                      </MenuItem>
                    ))
                    }
                  </Select>
                </FormControl>
              </ListItem>
              <Collapse in={algorithmType === 'simple'}>
                <div>
                  <ListItem>
                    <FormControl
                      variant="standard"
                      fullWidth
                      className={classes.formControlAlgo}
                    >
                      <TextField
                        id="standard-basic"
                        label="name"
                        variant="standard"
                        value={name}
                        name="name"
                        onChange={this.handleNewAlgoChange}
                      />
                    </FormControl>
                    <FormControl
                      variant="standard"
                      fullWidth

                    >
                      <TextField
                        label="Formula"
                        variant="standard"
                        name="formula"
                        value={formula}
                        onChange={this.handleNewAlgoChange}
                      />
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <FormControl
                      variant="standard"
                      fullWidth
                      className={classes.formControlAlgo}
                    >
                      <TextField
                        id="standard-basic"
                        label="Description"
                        variant="standard"
                        multiline
                        rows={4}
                        value={desc}
                        name="desc"
                        onChange={this.handleNewAlgoChange}
                      />
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <MathJax.Context input="ascii">
                      <div>
                        <h6>Your Formula</h6>
                        <MathJax.Node inline>{ formula }</MathJax.Node>
                      </div>
                    </MathJax.Context>
                  </ListItem>
                  <ListItem>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<Icon>save</Icon>}
                      onClick={this.handleSave}
                    >
                      Save
                    </Button>
                  </ListItem>
                </div>
              </Collapse>
            </DialogContentText>
          </DialogContent>
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
