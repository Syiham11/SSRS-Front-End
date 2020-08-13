import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import MathJax from 'react-mathjax2';
import {
  Chip,
  Divider,
  ListItem,
  Grid,
  Avatar,
  FormControl,
  TextField,
  Icon,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Snackbar,
  Slide,
  DialogActions,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@material-ui/core';
import { simplify, } from 'mathjs';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded';
import CloseIcon from '@material-ui/icons/Close';
import withStyles from '@material-ui/core/styles/withStyles';
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra.js';
import 'nerdamer/Calculus.js';
import 'nerdamer/Solve.js';
import { PropTypes } from 'prop-types';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';
import algorithmsServices from '../../Services/algorithm';
const S = require('string');


function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}
const styles = (theme) => ({
  btnSizing: {
    marginRight: '3px'
  },
  marginBottom: {
    marginBottom: '100px'
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  Col: {
    color: 'red'
  }
});

class Algorithms extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initState();
  }

  initState = () => ({
    simpleEq: {
      name: '',
      formula: '',
      desc: '',
      parameters: [
        {
          id: 1,
          name: '',
          value: '',
        }
      ]
    },
    derivativeEq: {
      nameD: '',
      formulaD: '',
      descD: '',
      parametersD: { name: '', value: '', },
      parametersDa: [
      ],
      numberOfDerivative: 1,
      formulaDCheck: '',
      variable: ''
    },
    integrateEq: {
      nameI: '',
      formulaI: '',
      descI: '',
      from: 0,
      to: 1,
    },
    booleanEq: {
      nameB: '',
      expression1: '',
      expression2: '',
      descB: '',
      typeB: '',
      signB: '',
      parametersB: [
      ],
    },
    textEq: {
      typeFunc: '',
      nameT: ''
    },
    replaceEq: {
      text: '',
      old: '',
      newText: ''
    },
    type: '',
    evaluateResult: 0,
    linearEquations: [],
    derivativeEquations: [],
    integrateEquations: [],
    booleanEquations: [],
    types: [
      {
        name: 'equals',
        value: 'eq',
        desc: 'Checks for equality of two expressions'
      },
      {
        name: 'less than',
        value: 'lt',
        desc: 'Checks if one expression is less than other'
      },
      {
        name: 'greater than',
        value: 'gt',
        desc: 'Checks if one expression is greater than other'
      },
      {
        name: 'less than or equals',
        value: 'lte',
        desc: 'Checks if one expression is less than, or equal to, other.'
      },
      {
        name: 'greater than or equals',
        value: 'gte',
        desc: 'Checks if one expression is greater than, or equal to, other.'
      },
    ],
    openD: false,
    openStack: false,
    openHelp: false,
    choice: '',
    toF: 0,
    fromF: 0,
    moreF: '',
    typesFunc: [
      {
        id: 1,
        name: 'contains',
        value: 'contains',
      },
      {
        id: 2,
        name: 'extract Between',
        value: 'between',
      },
      {
        id: 3,
        name: 'extract Word',
        value: 'word',
      },
      {
        id: 4,
        name: 'endWith',
        value: 'end',
      },
      {
        id: 5,
        name: 'remove',
        value: 'remove',
      },
      {
        id: 6,
        name: 'replace',
        value: 'replace'
      },
      {
        id: 7,
        name: 'startWith',
        value: 'start',
      },
    ],
    textResult: ''

  });

  initTextEq = () => ({
    text: '',
    old: '',
    newText: ''
  });

  handleCloseHelp = () => {
    this.setState({ openHelp: false });
  };

  handleClickOpenStack = () => {
    this.setState({ openStack: true });
  };

  handleCloseStack = () => {
    this.setState({ openStack: false });
  };

  handleChange = (ev, equation) => {
    if (equation === 'simple') {
      this.handleSimpleEqChange(ev);
    } else if (equation === 'derivative') {
      this.handleDerivativeEqChange(ev);
    } else if (equation === 'integrate') {
      this.handleIntegrateEqChange(ev);
    } else if (equation === 'boolean') {
      this.handleBooleanEqChange(ev);
    } else if (equation === 'text') {
      this.handleTextEqChange(ev);
    } else {
      this.setState({ [ev.target.name]: ev.target.value });
    }
  };

  handleTextEqChange = (ev) => {
    const { textEq } = this.state;
    const newTextEq = textEq;
    newTextEq[ev.target.name] = ev.target.value;
    this.setState({ textEq: newTextEq, replaceEq: this.initTextEq(), textResult: '' });
  };

  handleBooleanEqChange = (ev) => {
    const { booleanEq } = this.state;
    const newBooleanEq = booleanEq;
    newBooleanEq[ev.target.name] = ev.target.value;
    if (ev.target.name === 'typeB2') {
      if (ev.target.value === 'lte') {
        newBooleanEq.signB2 = '<=';
      } else if (ev.target.value === 'gte') {
        newBooleanEq.signB2 = '>=';
      } else if (ev.target.value === 'lt') {
        newBooleanEq.signB2 = '<';
      } else if (ev.target.value === 'gt') {
        newBooleanEq.signB2 = '>';
      } else if (ev.target.value === 'eq') {
        newBooleanEq.signB2 = '=';
      }
    }
    if (ev.target.name === 'typeB') {
      if (ev.target.value === 'lte') {
        newBooleanEq.signB = '<=';
      } else if (ev.target.value === 'gte') {
        newBooleanEq.signB = '>=';
      } else if (ev.target.value === 'lt') {
        newBooleanEq.signB = '<';
      } else if (ev.target.value === 'gt') {
        newBooleanEq.signB = '>';
      } else if (ev.target.value === 'eq') {
        newBooleanEq.signB = '=';
      }
    }
    this.setState({ booleanEq: newBooleanEq });
  };

  handleSimpleEqChange = (ev) => {
    const { simpleEq } = this.state;
    const newSimpleEq = simpleEq;
    newSimpleEq[ev.target.name] = ev.target.value;
    this.setState({ simpleEq: newSimpleEq });
  };

  handleIntegrateEqChange = (ev) => {
    const { integrateEq } = this.state;
    const newIntegrateEq = integrateEq;
    newIntegrateEq[ev.target.name] = ev.target.value;
    this.setState({ integrateEq: newIntegrateEq });
  };

  handleDerivativeEqChange = (ev) => {
    const { derivativeEq } = this.state;
    const newDerivativeEq = derivativeEq;
    newDerivativeEq[ev.target.name] = ev.target.value;
    newDerivativeEq.formulaDCheck = '';
    this.setState({ derivativeEq: newDerivativeEq });
  };

  handleSave = (algoType) => {
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
    if (algoType === 'simple') {
      const { simpleEq: { formula, name, desc }, linearEquations } = this.state;
      algo.algoType = 'simple';
      algo.algoDescription = desc;
      algo.algoName = name;
      algo.algoFormula = formula;
      algorithmsServices.saveAlgorithm(algo).then(result => {
        console.log(result.data);
      });
      linearEquations.push({ formula, name, desc });
      this.setState({
        simpleEq:
          {
            name: '',
            formula: '',
            desc: '',
            parameters: [
              {
                id: 1,
                name: '',
                value: '',
              }
            ]
          },
        type: '',
        evaluateResult: 0,
      });
      console.log(linearEquations);
    }
    if (algoType === 'integrate') {
      const {
        integrateEq:
          {
            nameI,
            formulaI,
            descI,
            from,
            to,
          },
        integrateEquations
      } = this.state;
      algo.algoName = nameI;
      algo.algoType = 'integrate';
      algo.algoFormula = formulaI;
      algo.algoDescription = descI;
      algorithmsServices.saveAlgorithm(algo).then(result => {
        console.log(result.data);
      });
      integrateEquations.push({
        formulaI,
        nameI,
        descI,
        from,
        to
      });
      this.setState({
        integrateEq:
          {
            nameI: '',
            formulaI: '',
            descI: '',
            from: 0,
            to: 1,
          },
        type: '',
        evaluateResult: 0,
      });
      console.log(integrateEquations);
    }
    if (algoType === 'derivative') {
      const {
        derivativeEq:
          {
            nameD,
            formulaD,
            descD,
            numberOfDerivative,
            formulaDCheck,
            parametersD
          },
        derivativeEquations
      } = this.state;
      algo.algoFormula = formulaDCheck;
      algo.algoType = 'derivative';
      algo.algoName = nameD;
      algo.algoDescription = `${descD}  ${formulaD} : derivative ${numberOfDerivative} times by ${parametersD.name}`;
      algorithmsServices.saveAlgorithm(algo).then(result => {
        console.log(result.data);
      });
      this.setState({
        derivativeEq: {
          nameD: '',
          formulaD: '',
          descD: '',
          parametersD: { name: '', value: '', },
          parametersDa: [
          ],
          numberOfDerivative: 1,
          formulaDCheck: '',
          variable: ''
        },
        type: '',
        evaluateResult: 0,
      });
      console.log(derivativeEquations);
    }
    if (algoType === 'boolean') {
      const {
        booleanEq: {
          nameB,
          expression1,
          expression2,
          descB,
          typeB,
          signB,
        },
        booleanEquations
      } = this.state;
      algo.algoName = nameB;
      algo.algoType = 'boolean';
      algo.algoDescription = descB;
      algo.algoFormula = expression1 + signB + expression2;
      algorithmsServices.saveAlgorithm(algo).then(result => {
        console.log(result.data);
      });
      booleanEquations.push({
        expression1,
        expression2,
        nameB,
        descB,
        typeB,
        signB,
      });
      this.setState({
        booleanEq: {
          nameB: '',
          expression1: '',
          expression2: '',
          descB: '',
          typeB: '',
          signB: '',
          parametersB: [
          ]
        },
        type: '',
        evaluateResult: 0,
      });
      console.log(booleanEquations);
    }
    this.handleClickOpenStack();
  };

  handleChangeType = (algoType) => {
    this.setState({ type: algoType, evaluateResult: 0 });
  };

  handleChangeParaName = (ev) => {
    const { simpleEq } = this.state;
    const newSimpleEq = simpleEq;
    const testDt = newSimpleEq.parameters.find((p) => p.id === Number.parseInt(ev.target.name, 10));
    testDt.name = ev.target.value;
    newSimpleEq.parameters = [...newSimpleEq.parameters.filter(p => p.id !== Number.parseInt(testDt.id, 10)), testDt].sort((a, b) => a.id - b.id);
    this.setState({ simpleEq: newSimpleEq });
  };

  handleAddPara = () => {
    const { simpleEq } = this.state;
    const newSimpleEq = simpleEq;
    newSimpleEq.parameters = [...newSimpleEq.parameters, { name: '', value: '', id: newSimpleEq.parameters.length + 1 }];
    this.setState({ simpleEq: newSimpleEq });
  };

  handleChangeParaValue = (ev) => {
    const { simpleEq } = this.state;
    const newSimpleEq = simpleEq;
    const testDt = newSimpleEq.parameters.find((p) => p.id === Number.parseInt(ev.target.name, 10));
    testDt.value = ev.target.value;
    newSimpleEq.parameters = [...newSimpleEq.parameters.filter(p => p.id !== Number.parseInt(testDt.id, 10)), testDt].sort((a, b) => a.id - b.id);
    this.setState({ simpleEq: newSimpleEq });
  };

  handleChangeParaValueDerivative = (ev) => {
    const { derivativeEq } = this.state;
    const newSimpleEq = derivativeEq;
    const testDt = newSimpleEq.parametersDa.find((p) => p.name === ev.target.name);
    console.log('value', ev.target.value);
    testDt.value = ev.target.value.toString();
    console.log(testDt);
    newSimpleEq.parametersDa = [...newSimpleEq.parametersDa.filter(p => p.name !== testDt.name), testDt];
    console.log('Nex', newSimpleEq.parametersDa);
    this.setState({ derivativeEq: newSimpleEq });
    console.log(derivativeEq);
  };

  handleChangeParaValueBoolean = (ev) => {
    const { booleanEq } = this.state;
    const newSimpleEq = booleanEq;
    const testDt = newSimpleEq.parametersB.find((p) => p.name === ev.target.name);
    console.log('value', ev.target.value);
    testDt.value = ev.target.value.toString();
    console.log(testDt);
    newSimpleEq.parametersB = [...newSimpleEq.parametersB.filter(p => p.name !== testDt.name), testDt];
    console.log('Nex', newSimpleEq.parametersB);
    this.setState({ derivativeEq: newSimpleEq });
  };

  handleSimpleEqApply = (der) => {
    if (der === 'simple') {
      const { simpleEq: { parameters, formula } } = this.state;
      const val = {};
      parameters.forEach(p => {
        val[p.name] = Number.parseInt(p.value, 10);
      });
      this.setState({ evaluateResult: simplify(formula, val).toString() });
    } else if (der === 'derivative') {
      const { derivativeEq: { parametersDa, formulaDCheck } } = this.state;
      const val = {};
      parametersDa.forEach(p => {
        console.log('Param', p);
        val[p.name] = Number.parseInt(p.value, 10);
      });
      console.log('valu', val);
      this.setState({ evaluateResult: simplify(formulaDCheck, val).toString() });
    } else if (der === 'integrate') {
      const { integrateEq: { formulaI, from, to } } = this.state;
      const x = nerdamer(`defint(${formulaI},${from}, ${to})`).toString();
      const Y = simplify(x, {}).toString();
      this.setState({ evaluateResult: Y });
    } else if (der === 'boolean') {
      const {
        booleanEq:
          {
            expression1,
            expression2,
            typeB,
            parametersB
          }
      } = this.state;
      let x = '';
      const val = {};
      parametersB.forEach(p => {
        console.log('Param', p);
        val[p.name] = Number.parseInt(p.value, 10);
      });
      const X = simplify(expression1, val).toString();
      const Y = simplify(expression2, val).toString();
      if (typeB === 'lte') {
        x = nerdamer(`${X}`).lte(`${Y}`);
      } else if (typeB === 'gte') {
        x = nerdamer(`${X}`).gte(`${Y}`);
      } else if (typeB === 'lt') {
        x = nerdamer(`${X}`).lt(`${Y}`);
      } else if (typeB === 'gt') {
        x = nerdamer(`${X}`).gt(`${Y}`);
      } else if (typeB === 'eq') {
        x = nerdamer(`${X}`).eq(`${Y}`);
      }

      this.setState({ evaluateResult: x.toString() });
    }
  };

  handleCheckFormula = () => {
    const { derivativeEq } = this.state;
    const x = nerdamer(`diff(${derivativeEq.formulaD}, ${derivativeEq.parametersD.name}, ${derivativeEq.numberOfDerivative})`);
    derivativeEq.formulaDCheck = x.toString();
    const y = nerdamer(derivativeEq.formulaDCheck).variables();
    const par = [];
    y.forEach((na) => {
      par.push({ name: na, value: '' });
    });
    derivativeEq.parametersDa = par;
    this.setState({ derivativeEq });
    console.log(derivativeEq);
  };

  handleCheckFormulaBoolean = () => {
    const { booleanEq } = this.state;
    const newBooleanEq = booleanEq;
    const y = nerdamer(`${newBooleanEq.expression1}+ ${newBooleanEq.expression2}`).variables();
    const par = [];
    y.forEach((na) => {
      par.push({ name: na, value: '' });
    });
    newBooleanEq.parametersB = par;
    this.setState({ booleanEq: newBooleanEq });
    console.log(newBooleanEq);
  };

  handleDerivativeEqParameter = (ev) => {
    const { derivativeEq } = this.state;
    derivativeEq.parametersD[ev.target.name] = ev.target.value;
    this.setState({ derivativeEq });
  };

  handleEditEq = (equation, typ) => {
    this.handleClose();
    const { simpleEq, derivativeEq } = this.state;
    if (typ === 1) {
      const newSimpleEq = simpleEq;
      newSimpleEq.formula = equation.formula;
      newSimpleEq.name = equation.name;
      newSimpleEq.desc = equation.desc;
      this.setState({ simpleEq: newSimpleEq, type: typ });
    }
    if (typ === 2) {
      const derivativeEqEq = derivativeEq;
      derivativeEqEq.formulaD = equation.formulaD;
      derivativeEqEq.nameD = equation.nameD;
      derivativeEqEq.descD = equation.descD;
      derivativeEqEq.numberOfDerivative = equation.numberOfDerivative;
      derivativeEqEq.formulaDCheck = equation.formulaDCheck;
      this.setState({ derivativeEq: derivativeEqEq, type: typ });
    }
  };

  valueChange = (e) => {
    console.log(e.target.value);
    this.setState({ choice: e.target.value });
    const { choice } = this.state;
    console.log(choice);
  };

  handleReplaceChange = (e) => {
    const { replaceEq } = this.state;
    const newReplaceEq = replaceEq;
    newReplaceEq[e.target.name] = e.target.value;
    this.setState({ replaceEq: newReplaceEq, });
  };

  handleReplaceCheck = () => {
    const {
      replaceEq:
        {
          text,
          old,
          newText
        }
    } = this.state;
    const result = S(text).replaceAll(old, newText).s;
    this.setState({ textResult: result });
  };

  handleReplaceSave = () => {
    const {
      replaceEq:
        {
          text,
          old,
          newText
        },
      textEq:
        {
          nameT,
          typeFunc
        }
    } = this.state;
    const newLine = {
      text,
      old,
      newText,
      name: nameT,
      type: typeFunc
    };
    console.log(newLine);
  };

  handleTrimCheck = () => {
    const { replaceEq: { text } } = this.state;
    const result = S('' + text + '').collapseWhitespace().s;
    this.setState({ textResult: result });
  };

  handleExtractCheck = () => {
    const { replaceEq: { text, old } } = this.state;
    const ArrayText = text.split(' ');
    const extractText = [];
    ArrayText.forEach((t) => {
      S(t).include(old) ? extractText.push(t) : null;
    });
    this.setState({ textResult: extractText });
  };

  handleBetweenCheck =() => {
    const { replaceEq: { text, old, newText } } = this.state;
    const result = S(text).between(old, newText).s;
    this.setState({ textResult: result });
  };

  handleRemoveCheck = () => {
    const { replaceEq: { text, old } } = this.state;
    const result = S(text).strip(old).collapseWhitespace().s;
    console.log(result);
    this.setState({ textResult: result });
  };

  handleContainsCheck = () => {
    const { replaceEq: { text, old } } = this.state;
    const result = S(text).include(old);
    this.setState({ textResult: result.toString() });
  };

  handleStartWithCheck = () => {
    const { replaceEq: { text, old } } = this.state;
    const result = S(text).startsWith(old);
    this.setState({ textResult: result });
  };

  handleEndsWithCheck = () => {
    const { replaceEq: { text, old } } = this.state;
    const result = S(text).endsWith(old);
    this.setState({ textResult: result });
  };

  render() {
    const title = brand.name + ' - Algorithms';
    const description = brand.desc;
    const {
      simpleEq:
        {
          name,
          formula,
          desc,
          parameters
        },
      type,
      evaluateResult,
      derivativeEq:
        {
          nameD,
          formulaD,
          descD,
          parametersD,
          numberOfDerivative,
          formulaDCheck,
          parametersDa
        },
      integrateEq: {
        nameI,
        formulaI,
        descI,
        from,
        to,
      },
      types,
      booleanEq: {
        nameB,
        expression1,
        expression2,
        descB,
        typeB,
        signB,
        parametersB
      },
      derivativeEquations,
      openStack,
      openHelp,
      choice,
      toF,
      fromF,
      moreF,
      typesFunc,
      textEq: {
        typeFunc,
        nameT
      },
      replaceEq: {
        text,
        old,
        newText
      },
      textResult
    } = this.state;
    const { classes, algorithms } = this.props;
    console.log(algorithms);
    const der = `(${formulaD})' => ${formulaDCheck}`;
    const int = `int_${from}^${to}(${formulaI})dx`;
    const bool = `${expression1}${signB}${expression2}`;
    const more = `${choice}_${fromF}^${toF}(${moreF})`;
    const f = nerdamer('x^2+2x*y').variables();
    console.log(f);
    const result = nerdamer('cos(x*y)').evaluate({ x: 6, y: 1 });
    console.log(result.text());
    const x = nerdamer('sqrt(2)').lt('2^(1/2)');
    console.log(x.toString());
    const phrase = S('JavaScript is the best scripting language ever!');
    const sub = 'best scripting';
    const pos = phrase.indexOf(sub);
    console.log(pos);
    console.log(phrase.substr(pos, sub.length).s);
    const str = 'The rain in SPAIN stays mainly in the plrain';
    const res = str.match(/rain/g);
    console.log(res);
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
        </Helmet>
        <PapperBlock
          title="Algorithms"
          desc="There You can create and edit all algorithms that you want"
          whiteBg
          noMargin
          icon="ios-hammer-outline"
        >
          <Grid container spacing={3} className={classes.marginBottom}>
            <Grid item xs={12} sm={3}>
              <Box display="flex" component={ListItem}>
                <Box flexGrow={1}>
                  <Chip label="Simple Equation" avatar={<Avatar>S</Avatar>} color="primary" />
                </Box>
                <Box>
                  <Tooltip
                    title={<Typography variant="body1">Click to see all the Linear Equations already created</Typography>}
                    arrow
                    enterDelay={200}
                    leaveDelay={200}
                    className={classes.TitleSize}
                  >
                    <IconButton
                      color="secondary"
                      onClick={this.handleClickOpen}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box>
                  <Tooltip title="Click To add New Linear Equation" arrow>
                    <IconButton color="primary" onClick={() => this.handleChangeType(1)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box>
                  <Tooltip title="Help">
                    <IconButton onClick={this.handleClickOpenHelp}>
                      <HelpOutlineRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Divider variant="middle" />
              {
                type === 1 ? (
                  <div>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          id="standard-basic"
                          label="name"
                          variant="standard"
                          value={name}
                          name="name"
                          onChange={(event) => this.handleChange(event, 'simple')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          label="Formula"
                          variant="standard"
                          name="formula"
                          value={formula}
                          onChange={(event) => this.handleChange(event, 'simple')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          id="standard-basic"
                          label="Description"
                          variant="standard"
                          multiline
                          rows={4}
                          value={desc}
                          name="desc"
                          onChange={(event) => this.handleChange(event, 'simple')}
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
                      <Chip label="Give values to test your Formula " avatar={<Avatar>G</Avatar>} color="secondary" />
                    </ListItem>
                    <Divider variant="middle" />
                    {
                      parameters.map((para) => (
                        <div key={para.id}>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="parameter name"
                                variant="filled"
                                value={para.name}
                                name={para.id}
                                onChange={this.handleChangeParaName}
                              />
                            </FormControl>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="parameter value"
                                variant="filled"
                                value={para.value}
                                name={para.id}
                                onChange={this.handleChangeParaValue}
                              />
                            </FormControl>
                          </ListItem>
                        </div>
                      ))
                    }
                    <ListItem>
                      <Tooltip
                        title="add new parameter"
                        arrow
                      >
                        <IconButton color="primary" onClick={this.handleAddPara}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <MathJax.Context input="ascii">
                        <div>
                          <Typography variant="body1">Evaluation result:</Typography>
                          <MathJax.Node inline>{evaluateResult}</MathJax.Node>
                        </div>
                      </MathJax.Context>
                    </ListItem>
                    <ListItem>
                      <Button
                        className={classes.btnSizing}
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleSimpleEqApply('simple')}
                      >
                        check
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Icon>save</Icon>}
                        onClick={() => this.handleSave('simple')}
                      >
                        Save
                      </Button>
                    </ListItem>
                  </div>
                ) : null
              }

            </Grid>
            <Grid item xs={12} sm={3}>
              <Box display="flex" component={ListItem}>
                <Box flexGrow={2}>
                  <Chip label="Derivation" avatar={<Avatar>D</Avatar>} color="primary" />
                </Box>
                {
                  derivativeEquations.length > 0 ? (
                    <Box>
                      <Tooltip
                        title={<Typography variant="h5" component="p">Click to see all the Derivative Equations already created</Typography>}
                        arrow
                        enterDelay={200}
                        leaveDelay={200}
                        className={classes.TitleSize}
                      >
                        <IconButton
                          color="secondary"
                          onClick={this.handleClickOpenD}
                        >
                          <MenuIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : null
                }
                <Box>
                  <Tooltip title={<Typography component="p">Click To add New Derivative Equation</Typography>} arrow>
                    <IconButton color="primary" onClick={() => this.handleChangeType(2)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Divider variant="middle" />
              {
                type === 2 ? (
                  <div>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          id="standard-basic"
                          label="name"
                          variant="standard"
                          value={nameD}
                          name="nameD"
                          onChange={(event) => this.handleChange(event, 'derivative')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          label="Formula"
                          variant="standard"
                          name="formulaD"
                          value={formulaD}
                          onChange={(event) => this.handleChange(event, 'derivative')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                        className={classes.btnSizing}
                      >
                        <TextField
                          label="number of derivative"
                          variant="standard"
                          name="numberOfDerivative"
                          value={numberOfDerivative}
                          type="number"
                          onChange={(event) => this.handleChange(event, 'derivative')}
                        />
                      </FormControl>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          label="variable"
                          variant="standard"
                          name="name"
                          value={parametersD.name}
                          onChange={this.handleDerivativeEqParameter}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          id="standard-basic"
                          label="Description"
                          variant="standard"
                          multiline
                          rows={4}
                          value={descD}
                          name="descD"
                          onChange={(event) => this.handleChange(event, 'derivative')}
                        />
                      </FormControl>
                    </ListItem>
                    <Tooltip
                      title="click to check your Formula"
                      arrow
                    >
                      <IconButton
                        color="primary"
                        onClick={this.handleCheckFormula}
                        disabled={!parametersD.name}
                      >
                        <DoneAllIcon />
                      </IconButton>
                    </Tooltip>
                    {
                      formulaDCheck ? (
                        <ListItem>
                          <MathJax.Context input="ascii">
                            <div>
                              <h6>Your Formula</h6>
                              <MathJax.Node inline>{der}</MathJax.Node>
                            </div>
                          </MathJax.Context>
                        </ListItem>
                      ) : null
                    }
                    <ListItem>
                      <Chip label="Give values to test your Formula " avatar={<Avatar>G</Avatar>} color="secondary" />
                    </ListItem>
                    <Divider variant="middle" />
                    <div>
                      {
                        parametersDa.map((p) => (
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="parameter name"
                                variant="filled"
                                value={p.name}
                                disabled
                              />
                            </FormControl>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="parameter value"
                                variant="filled"
                                value={p.value}
                                name={p.name}
                                onChange={this.handleChangeParaValueDerivative}
                              />
                            </FormControl>
                          </ListItem>
                        ))
                      }
                    </div>
                    <ListItem>
                      <MathJax.Context input="ascii">
                        <div>
                          <Typography variant="body1">Evaluation result:</Typography>
                          <MathJax.Node inline>{evaluateResult}</MathJax.Node>
                        </div>
                      </MathJax.Context>
                    </ListItem>
                    <ListItem>
                      <Button
                        className={classes.btnSizing}
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleSimpleEqApply('derivative')}
                      >
                        check
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Icon>save</Icon>}
                        onClick={() => this.handleSave('derivative')}
                      >
                        Save
                      </Button>
                    </ListItem>
                  </div>
                ) : null
              }
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box display="flex" component={ListItem}>
                <Box flexGrow={2}>
                  <Chip label="Integrate" avatar={<Avatar>I</Avatar>} color="primary" />
                </Box>
                <Box>
                  <Tooltip title={<Typography variant="body1">Click To add New Integrate Equation</Typography>} arrow>
                    <IconButton color="primary" onClick={() => this.handleChangeType(3)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Divider variant="middle" />
              {
                type === 3 ? (
                  <div>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          id="standard-basic"
                          label="name"
                          variant="standard"
                          value={nameI}
                          name="nameI"
                          onChange={(event) => this.handleChange(event, 'integrate')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          label="Formula"
                          variant="standard"
                          name="formulaI"
                          value={formulaI}
                          onChange={(event) => this.handleChange(event, 'integrate')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                        className={classes.btnSizing}
                      >
                        <TextField
                          label="From"
                          variant="standard"
                          name="from"
                          type="number"
                          value={from}
                          onChange={(event) => this.handleChange(event, 'integrate')}
                        />
                      </FormControl>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          label="To"
                          variant="standard"
                          name="to"
                          type="number"
                          value={to}
                          onChange={(event) => this.handleChange(event, 'integrate')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          id="standard-basic"
                          label="Description"
                          variant="standard"
                          multiline
                          rows={4}
                          value={descI}
                          name="descI"
                          onChange={(event) => this.handleChange(event, 'integrate')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <MathJax.Context input="ascii">
                        <div>
                          <h6>Your Formula</h6>
                          <MathJax.Node inline>{ int }</MathJax.Node>
                        </div>
                      </MathJax.Context>
                    </ListItem>
                    <ListItem>
                      <Chip label="Give values to test your Formula " avatar={<Avatar>G</Avatar>} color="secondary" />
                    </ListItem>
                    <Divider variant="middle" />
                    <ListItem>
                      <MathJax.Context input="ascii">
                        <div>
                          <Typography variant="body1">Evaluation result:</Typography>
                          <MathJax.Node inline>{ evaluateResult }</MathJax.Node>
                        </div>
                      </MathJax.Context>
                    </ListItem>
                    <ListItem>
                      <Button
                        className={classes.btnSizing}
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleSimpleEqApply('integrate')}
                      >
                        check
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Icon>save</Icon>}
                        onClick={() => this.handleSave('integrate')}
                      >
                        Save
                      </Button>
                    </ListItem>
                  </div>
                ) : null
              }
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box display="flex" component={ListItem}>
                <Box flexGrow={2}>
                  <Chip label="Boolean & Text" avatar={<Avatar>BT</Avatar>} color="primary" />
                </Box>
                <Box>
                  <Tooltip title={<Typography variant="body1">Click To add New Boolean Equation</Typography>} arrow>
                    <IconButton color="primary" onClick={() => this.handleChangeType(4)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Divider variant="middle" />
              {
                type === 4 ? (
                  <div>
                    <ListItem>
                      <Button onClick={() => this.handleChangeType(6)} color="primary">Text</Button>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          id="standard-basic"
                          label="name"
                          variant="standard"
                          value={nameB}
                          name="nameB"
                          onChange={(event) => this.handleChange(event, 'boolean')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          label="Expression 1"
                          variant="standard"
                          name="expression1"
                          value={expression1}
                          onChange={(event) => this.handleChange(event, 'boolean')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        fullWidth
                      >
                        <InputLabel>
                          Boolean Type
                        </InputLabel>
                        <Select
                          name="typeB"
                          value={typeB}
                          onChange={(event) => this.handleChange(event, 'boolean')}
                        >

                          {types.map((t) => (
                            <MenuItem
                              key={t.name}
                              value={t.value}
                            >
                              {t.name}
                            </MenuItem>

                          ))
                          }
                        </Select>
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          label="Expression 2"
                          variant="standard"
                          name="expression2"
                          value={expression2}
                          onChange={(event) => this.handleChange(event, 'boolean')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          id="standard-basic"
                          label="Description"
                          variant="standard"
                          multiline
                          rows={4}
                          value={descB}
                          name="descB"
                          onChange={(event) => this.handleChange(event, 'boolean')}
                        />
                      </FormControl>
                    </ListItem>
                    <Tooltip
                      title="click to check your Formula"
                      arrow
                    >
                      <IconButton
                        color="primary"
                        onClick={this.handleCheckFormulaBoolean}
                      >
                        <DoneAllIcon />
                      </IconButton>
                    </Tooltip>
                    <ListItem>
                      <MathJax.Context input="ascii">
                        <div>
                          <h6>Your Formula</h6>
                          <MathJax.Node inline>{ bool }</MathJax.Node>
                        </div>
                      </MathJax.Context>
                    </ListItem>
                    <ListItem>
                      <Chip label="Give values to test your Formula " avatar={<Avatar>G</Avatar>} color="secondary" />
                    </ListItem>
                    <Divider variant="middle" />
                    <div>
                      {
                        parametersB.map((p) => (
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="parameter name"
                                variant="filled"
                                value={p.name}
                                disabled
                              />
                            </FormControl>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="parameter value"
                                variant="filled"
                                value={p.value}
                                name={p.name}
                                onChange={this.handleChangeParaValueBoolean}
                              />
                            </FormControl>
                          </ListItem>
                        ))
                      }
                    </div>
                    <ListItem>
                      <MathJax.Context input="ascii">
                        <div>
                          <Typography variant="body1">Evaluation result:</Typography>
                          <MathJax.Node inline>{ evaluateResult }</MathJax.Node>
                        </div>
                      </MathJax.Context>
                    </ListItem>
                    <ListItem>
                      <Button
                        className={classes.btnSizing}
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleSimpleEqApply('boolean')}
                      >
                        check
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Icon>save</Icon>}
                        onClick={() => this.handleSave('boolean')}
                      >
                        Save
                      </Button>
                    </ListItem>
                  </div>
                ) : null
              }
              {
                type === 6 ? (
                  <React.Fragment>
                    <ListItem>
                      <FormControl
                        variant="standard"
                        fullWidth
                      >
                        <TextField
                          id="standard-basic"
                          label="name"
                          variant="standard"
                          value={nameT}
                          name="nameT"
                          onChange={(event) => this.handleChange(event, 'text')}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl
                        fullWidth
                      >
                        <InputLabel>
                          function Type
                        </InputLabel>
                        <Select
                          name="typeFunc"
                          value={typeFunc}
                          onChange={(event) => this.handleChange(event, 'text')}
                        >

                          {typesFunc.map((t) => (
                            <MenuItem
                              key={t.id}
                              value={t.value}
                            >
                              {t.name}
                            </MenuItem>

                          ))
                          }
                        </Select>
                      </FormControl>
                    </ListItem>
                    {
                      typeFunc === 'replace' ? (
                        <React.Fragment>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Text"
                                variant="standard"
                                value={text}
                                name="text"
                                multiline
                                rows={3}
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                              className={classes.btnSizing}
                            >
                              <TextField
                                id="standard-basic"
                                label="old String"
                                variant="standard"
                                value={old}
                                name="old"
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="new String"
                                variant="standard"
                                value={newText}
                                name="newText"
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          {
                            textResult ? (
                              <ListItem>
                                <Typography>
                                  {textResult}
                                </Typography>
                              </ListItem>
                            ) : null
                          }
                          <ListItem>
                            <Button
                              className={classes.btnSizing}
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={this.handleReplaceCheck}
                            >
                              check
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<Icon>save</Icon>}
                              onClick={this.handleReplaceSave}
                            >
                              Save
                            </Button>
                          </ListItem>
                        </React.Fragment>
                      ) : null
                    }
                    {
                      typeFunc === 'trim' ? (
                        <React.Fragment>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Text"
                                variant="standard"
                                value={text}
                                name="text"
                                multiline
                                rows={3}
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <Button
                              className={classes.btnSizing}
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={this.handleTrimCheck}
                            >
                              check
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<Icon>save</Icon>}
                              onClick={this.handleTrimSave}
                            >
                              Save
                            </Button>
                          </ListItem>
                        </React.Fragment>
                      ) : null
                    }
                    {
                      typeFunc === 'word' ? (
                        <React.Fragment>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Text"
                                variant="standard"
                                value={text}
                                name="text"
                                multiline
                                rows={3}
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                              className={classes.btnSizing}
                            >
                              <TextField
                                id="standard-basic"
                                label="text"
                                variant="standard"
                                value={old}
                                name="old"
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          {
                            textResult ? (
                              <ListItem>
                                <Typography>
                                  {textResult}
                                </Typography>
                              </ListItem>
                            ) : null
                          }
                          <ListItem>
                            <Button
                              className={classes.btnSizing}
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={this.handleExtractCheck}
                            >
                              check
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<Icon>save</Icon>}
                              onClick={this.handleTrimSave}
                            >
                              Save
                            </Button>
                          </ListItem>
                        </React.Fragment>
                      ) : null
                    }
                    {
                      typeFunc === 'between' ? (
                        <React.Fragment>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Text"
                                variant="standard"
                                value={text}
                                name="text"
                                multiline
                                rows={3}
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                              className={classes.btnSizing}
                            >
                              <TextField
                                id="standard-basic"
                                label="Left"
                                variant="standard"
                                value={old}
                                name="old"
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Right"
                                variant="standard"
                                value={newText}
                                name="newText"
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          {
                            textResult ? (
                              <ListItem>
                                <Typography>
                                  {textResult}
                                </Typography>
                              </ListItem>
                            ) : null
                          }
                          <ListItem>
                            <Button
                              className={classes.btnSizing}
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={this.handleBetweenCheck}
                            >
                              check
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<Icon>save</Icon>}
                              onClick={this.handleBetweenSave}
                            >
                              Save
                            </Button>
                          </ListItem>
                        </React.Fragment>
                      ) : null
                    }
                    {
                      typeFunc === 'remove' ? (
                        <React.Fragment>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Text"
                                variant="standard"
                                value={text}
                                name="text"
                                multiline
                                rows={3}
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                              className={classes.btnSizing}
                            >
                              <TextField
                                id="standard-basic"
                                label="text To remove"
                                variant="standard"
                                value={old}
                                name="old"
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          {
                            textResult ? (
                              <ListItem>
                                <Typography>
                                  {textResult}
                                </Typography>
                              </ListItem>
                            ) : null
                          }
                          <ListItem>
                            <Button
                              className={classes.btnSizing}
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={this.handleRemoveCheck}
                            >
                              check
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<Icon>save</Icon>}
                              onClick={this.handleBetweenSave}
                            >
                              Save
                            </Button>
                          </ListItem>
                        </React.Fragment>
                      ) : null
                    }
                    {
                      typeFunc === 'contains' ? (
                        <React.Fragment>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Text"
                                variant="standard"
                                value={text}
                                name="text"
                                multiline
                                rows={3}
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                              className={classes.btnSizing}
                            >
                              <TextField
                                id="standard-basic"
                                label="String"
                                variant="standard"
                                value={old}
                                name="old"
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          {
                            textResult ? (
                              <ListItem>
                                <Typography>
                                  {textResult}
                                </Typography>
                              </ListItem>
                            ) : null
                          }
                          <ListItem>
                            <Button
                              className={classes.btnSizing}
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={this.handleContainsCheck}
                            >
                              check
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<Icon>save</Icon>}
                              onClick={this.handleBetweenSave}
                            >
                              Save
                            </Button>
                          </ListItem>
                        </React.Fragment>
                      ) : null
                    }
                    {
                      typeFunc === 'start' ? (
                        <React.Fragment>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Text"
                                variant="standard"
                                value={text}
                                name="text"
                                multiline
                                rows={3}
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                              className={classes.btnSizing}
                            >
                              <TextField
                                id="standard-basic"
                                label="String"
                                variant="standard"
                                value={old}
                                name="old"
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          {
                            textResult ? (
                              <ListItem>
                                <Typography>
                                  {textResult}
                                </Typography>
                              </ListItem>
                            ) : null
                          }
                          <ListItem>
                            <Button
                              className={classes.btnSizing}
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={this.handleStartWithCheck}
                            >
                              check
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<Icon>save</Icon>}
                              onClick={this.handleBetweenSave}
                            >
                              Save
                            </Button>
                          </ListItem>
                        </React.Fragment>
                      ) : null
                    }
                    {
                      typeFunc === 'end' ? (
                        <React.Fragment>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Text"
                                variant="standard"
                                value={text}
                                name="text"
                                multiline
                                rows={3}
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                              className={classes.btnSizing}
                            >
                              <TextField
                                id="standard-basic"
                                label="String"
                                variant="standard"
                                value={old}
                                name="old"
                                onChange={this.handleReplaceChange}
                              />
                            </FormControl>
                          </ListItem>
                          {
                            textResult ? (
                              <ListItem>
                                <Typography>
                                  {textResult}
                                </Typography>
                              </ListItem>
                            ) : null
                          }
                          <ListItem>
                            <Button
                              className={classes.btnSizing}
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={this.handleEndsWithCheck}
                            >
                              check
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<Icon>save</Icon>}
                              onClick={this.handleBetweenSave}
                            >
                              Save
                            </Button>
                          </ListItem>
                        </React.Fragment>
                      ) : null
                    }
                  </React.Fragment>
                ) : null
              }
            </Grid>
          </Grid>
          {
            type === 5 ? (
              <Grid container spacing={3} alignItems="flex-start" direction="row" justify="center">
                <Grid item xs={12} md={6}>
                  <form>
                    <ListItem>
                      <RadioGroup row aria-label="position" name="position" onChange={this.valueChange}>
                        <FormControlLabel
                          value="sum"
                          control={<Radio color="primary" />}
                          label={
                            (
                              <MathJax.Context input="ascii">
                                <div>
                                  <MathJax.Node inline>sum</MathJax.Node>
                                </div>
                              </MathJax.Context>
                            )
                          }
                        />
                        <FormControlLabel
                          value="prod"
                          control={<Radio color="primary" />}
                          label={
                            (
                              <MathJax.Context input="ascii">
                                <div>
                                  <MathJax.Node inline>prod</MathJax.Node>
                                </div>
                              </MathJax.Context>
                            )
                          }
                        />
                        <FormControlLabel
                          value="sumProd"
                          control={<Radio color="primary" />}
                          label={
                            (
                              <MathJax.Context input="ascii">
                                <div>
                                  <MathJax.Node inline>sum prod</MathJax.Node>
                                </div>
                              </MathJax.Context>
                            )
                          }
                        />
                        <FormControlLabel
                          value="prodSum"
                          control={<Radio color="primary" />}
                          label={
                            (
                              <MathJax.Context input="ascii">
                                <div>
                                  <MathJax.Node inline>prod sum</MathJax.Node>
                                </div>
                              </MathJax.Context>
                            )
                          }
                        />
                        <FormControlLabel
                          value="intSum"
                          control={<Radio color="primary" />}
                          label={
                            (
                              <MathJax.Context input="ascii">
                                <div>
                                  <MathJax.Node inline>int sum</MathJax.Node>
                                </div>
                              </MathJax.Context>
                            )
                          }
                        />
                        <FormControlLabel
                          value="intProd"
                          control={<Radio color="primary" />}
                          label={
                            (
                              <MathJax.Context input="ascii">
                                <div>
                                  <MathJax.Node inline>int prod</MathJax.Node>
                                </div>
                              </MathJax.Context>
                            )
                          }
                        />
                        <FormControlLabel
                          value="intSumProd"
                          control={<Radio color="primary" />}
                          label={
                            (
                              <MathJax.Context input="ascii">
                                <div>
                                  <MathJax.Node inline>int sum prod</MathJax.Node>
                                </div>
                              </MathJax.Context>
                            )
                          }
                        />
                      </RadioGroup>
                    </ListItem>
                    {
                      choice === 'sum' || choice === 'prod' ? (
                        <div>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                              className={classes.btnSizing}
                            >
                              <TextField
                                id="standard-basic"
                                label="name"
                                variant="standard"
                                value={nameI}
                                name="nameI"
                                onChange={(event) => this.handleChange(event, 'integrate')}
                              />
                            </FormControl>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                label="Formula"
                                variant="standard"
                                name="moreF"
                                value={moreF}
                                onChange={(event) => this.handleChange(event, '')}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                              className={classes.btnSizing}
                            >
                              <TextField
                                label="From"
                                variant="standard"
                                name="fromF"
                                type="number"
                                value={fromF}
                                onChange={(event) => this.handleChange(event, '')}
                              />
                            </FormControl>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                label="To"
                                variant="standard"
                                name="toF"
                                type="number"
                                value={toF}
                                onChange={(event) => this.handleChange(event, '')}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <FormControl
                              variant="standard"
                              fullWidth
                            >
                              <TextField
                                id="standard-basic"
                                label="Description"
                                variant="standard"
                                multiline
                                rows={4}
                                value={descI}
                                name="descI"
                                onChange={(event) => this.handleChange(event, 'integrate')}
                              />
                            </FormControl>
                          </ListItem>
                          <ListItem>
                            <MathJax.Context input="ascii">
                              <div>
                                <h6>Your Formula</h6>
                                <MathJax.Node inline>{ more }</MathJax.Node>
                              </div>
                            </MathJax.Context>
                          </ListItem>
                          <ListItem>
                            <Chip label="Give values to test your Formula " avatar={<Avatar>G</Avatar>} color="secondary" />
                          </ListItem>
                          <Divider variant="middle" />
                          <ListItem>
                            <MathJax.Context input="ascii">
                              <div>
                                <Typography variant="body1">Evaluation result:</Typography>
                                <MathJax.Node inline>{ evaluateResult }</MathJax.Node>
                              </div>
                            </MathJax.Context>
                          </ListItem>
                        </div>
                      ) : null
                    }
                    <ListItem>
                      <Button
                        type="button"
                      >
                        check
                      </Button>
                      <Button variant="contained" color="secondary" type="submit">
                        Save
                      </Button>
                    </ListItem>
                  </form>
                </Grid>
              </Grid>
            ) : null
          }
        </PapperBlock>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={openStack}
          autoHideDuration={6000}
          onClose={this.handleCloseStack}
          message="Algorithms created!!"
          TransitionComponent={TransitionLeft}
          action={
            (
              <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleCloseStack}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            )
          }
        />
        <div>
          <Dialog onClose={this.handleCloseHelp} aria-labelledby="customized-dialog-title" open={openHelp}>
            <Box display="flex" component={ListItem}>
              <Box flexGrow={1}>
                <Typography variant="h5" component="h5" color="primary">
                  Help Page
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={this.handleCloseHelp}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <DialogContent dividers>
              <div>
                <Typography gutterBottom>
                  Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                  in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                </Typography>
              </div>

              <Typography gutterBottom>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                lacus vel augue laoreet rutrum faucibus dolor auctor.
              </Typography>
              <Typography gutterBottom>
                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                auctor fringilla.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseHelp} color="primary">
                close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}
Algorithms.propTypes = {
  classes: PropTypes.object.isRequired,
  algorithms: PropTypes.array.isRequired,
};
export default withStyles(styles)(Algorithms);
