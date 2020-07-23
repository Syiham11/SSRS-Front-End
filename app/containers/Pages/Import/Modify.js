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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setData } from 'dan-actions/importedDataActions';
import PropTypes from 'prop-types';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined';
import styles from './import-jss';

const types = [
  { id: 'CHAR', name: 'CHAR' },
  { id: 'VARCHAR', name: 'VARCHAR' },
  { id: 'BINARY', name: 'BINARY' },
  { id: 'VARBINARY', name: 'VARBINARY' },
  { id: 'TINYBLOB', name: 'TINYBLOB' },
  { id: 'TINYTEXT', name: 'TINYTEXT' },
  { id: 'TEXT', name: 'TEXT' },
  { id: 'BLOB', name: 'BLOB' },
  { id: 'BIT', name: 'BIT' },
  { id: 'TINYINT', name: 'TINYINT' },
  { id: 'BOOLEAN', name: 'BOOLEAN' },
  { id: 'INTEGER', name: 'INTEGER' },
  { id: 'FLOAT', name: 'FLOAT' },
  { id: 'DOUBLE', name: 'DOUBLE' },
  { id: 'DECIMAL', name: 'DECIMAL' },
  { id: 'DATE', name: 'DATE' },
  { id: 'DATETIME', name: 'DATETIME' },
  { id: 'TIMESTAMP', name: 'TIMESTAMP' }
];

class Modify extends Component {
  state = {
    isModifyAttribute: false,
    isModifyValue: false,
    selectedAttribute: '',
    isSpinnerShowed: false,
    newNameText: '',
    newValueText: '',
    existValueText: ''
  };

  handleModifyAttributeClick = () => {
    const { isModifyAttribute } = this.state;
    this.setState({
      isModifyAttribute: !isModifyAttribute,
      isModifyValue: false
    });
  };

  handleModifyValueClick = () => {
    const { isModifyValue } = this.state;
    this.setState({
      isModifyValue: !isModifyValue,
      isModifyAttribute: false
    });
  };

  handleAttributeNameChange = event => {
    this.setState({
      selectedAttribute: event.target.value
    });
  };

  handleAttributeTypeChange = event => {
    this.setState({
      modifiedType: event.target.value
    });
  };

  handleChangeNameText = event => {
    this.setState({
      newNameText: event.target.value
    });
  };

  handleExistValueText = event => {
    this.setState({
      existValueText: event.target.value
    });
  };

  handleNewValueText = event => {
    this.setState({
      newValueText: event.target.value
    });
  };

  handleRenameDoneClick = () => {
    const { selectedAttribute, newNameText } = this.state;
    const { tableData, setTableData } = this.props;
    this.setState({
      isSpinnerShowed: true
    });
    setTimeout(() => {
      let data = JSON.parse(JSON.stringify(tableData));
      data = data.map(obj => {
        let newObj = {};
        Object.keys(obj).forEach(key => {
          if (key === selectedAttribute) {
            const newPair = { [newNameText]: obj[selectedAttribute] };
            newObj = { ...newObj, ...newPair };
          } else {
            newObj = { ...newObj, [key]: obj[key] };
          }
        });
        return newObj;
      });
      setTableData(data);
      this.setState({
        isSpinnerShowed: false
      });
    }, 50);
    this.setState({
      newNameText: '',
      isModifyName: false,
      isModifyType: false
    });
    /* axios
      .post('http://localhost:9090/check', {
        data: tableData
      })
      .then(response => {
        console.log('response');
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      }); */
  };

  handleRenameClick = () => {
    const { isModifyName } = this.state;
    this.setState({
      isModifyName: !isModifyName,
      isModifyType: false
    });
  };

  handleTypeChangeClick = () => {
    const { isModifyType } = this.state;
    this.setState({
      isModifyType: !isModifyType,
      isModifyName: false
    });
  };

  handleDeleteClick = () => {
    const { selectedAttribute } = this.state;
    const { tableData, setTableData } = this.props;
    this.setState({
      isSpinnerShowed: true
    });
    setTimeout(() => {
      const data = JSON.parse(JSON.stringify(tableData));
      data.forEach(k => delete k[selectedAttribute]);
      setTableData(data);
      this.setState({
        isSpinnerShowed: false
      });
    }, 100);
  };

  handleReplaceClick = () => {
    const { selectedAttribute, newValueText, existValueText } = this.state;
    const { tableData, setTableData } = this.props;
    this.setState({
      isSpinnerShowed: true
    });
    setTimeout(() => {
      let data = JSON.parse(JSON.stringify(tableData));
      // data.find(v => v[selectedAttribute].toLowerCase().includes(existValueText.toLowerCase()))[selectedAttribute] = false;
      data = data.map(item => {
        if (typeof item[selectedAttribute] === 'number') {
          if (item[selectedAttribute] === parseInt(existValueText, 10)) {
            item[selectedAttribute] = parseInt(newValueText, 10);
          }
        } else if (
          item[selectedAttribute]
            .toLowerCase()
            .includes(existValueText.toLowerCase())
        ) {
          item[selectedAttribute] = item[selectedAttribute].replace(
            existValueText,
            newValueText
          );
        }
        return item;
      });
      setTableData(data);
      this.setState({
        isSpinnerShowed: false
      });
    }, 100);
  };

  render() {
    const {
      isSpinnerShowed,
      isModifyValue,
      isModifyAttribute,
      isModifyName,
      isModifyType,
      selectedAttribute,
      modifiedType
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
                isModifyAttribute ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              className={
                isModifyAttribute
                  ? classes.buttonMenuSelected
                  : classes.buttonMenu
              }
              onClick={this.handleModifyAttributeClick}
            >
              Modify attribute
            </Button>
            <Button
              endIcon={
                isModifyValue ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )
              }
              className={
                isModifyValue ? classes.buttonMenuSelected : classes.buttonMenu
              }
              onClick={this.handleModifyValueClick}
            >
              Modify value
            </Button>
          </div>
          <Collapse in={isModifyValue}>
            <Grid
              container
              spacing={3}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} md={8}>
                <div className={classes.divSpace}>
                  <FormControl
                    className={classes.formControl}
                    style={{ minWidth: '30%' }}
                  >
                    <InputLabel>Choose column</InputLabel>
                    <Select
                      name="attributeName"
                      value={selectedAttribute}
                      onChange={this.handleAttributeNameChange}
                    >
                      {keys.map(key => (
                        <MenuItem key={key} value={key}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    id="outlined-basic"
                    label="Exist Value"
                    variant="outlined"
                    style={{ minWidth: '30%' }}
                    onChange={this.handleExistValueText}
                    className={classes.textField}
                  />
                  <TextField
                    id="outlined-basic"
                    label="New Value"
                    variant="outlined"
                    style={{ minWidth: '30%' }}
                    onChange={this.handleNewValueText}
                    className={classes.textField}
                  />
                </div>
                <div className={classes.divCenter}>
                  <Button
                    className={classes.button}
                    onClick={this.handleReplaceClick}
                  >
                    Replace
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Collapse>
          <Collapse in={isModifyAttribute}>
            <Grid
              container
              spacing={3}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} md={10}>
                <div className={classes.divCenter}>
                  <FormControl
                    className={classes.formControl}
                    style={{ minWidth: '50%' }}
                  >
                    <InputLabel>Choose attribute</InputLabel>
                    <Select
                      name="attributeName"
                      value={selectedAttribute}
                      onChange={this.handleAttributeNameChange}
                    >
                      {keys.map(key => (
                        <MenuItem key={key} value={key}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <Collapse in={isModifyName}>
                  <div className={classes.divCenter}>
                    <TextField
                      id="outlined-basic"
                      label="Insert new name"
                      variant="outlined"
                      style={{ minWidth: '50%' }}
                      onChange={this.handleChangeNameText}
                      className={classes.textField}
                    />
                  </div>
                  <div className={classes.divCenter}>
                    <IconButton
                      aria-label="done"
                      className={classes.margin}
                      onClick={this.handleRenameDoneClick}
                    >
                      <DoneOutlinedIcon />
                    </IconButton>
                  </div>
                </Collapse>
                <Collapse in={isModifyType}>
                  <div className={classes.divCenter}>
                    <FormControl
                      className={classes.formControl}
                      style={{ minWidth: '50%' }}
                    >
                      <InputLabel>Choose type</InputLabel>
                      <Select
                        name="attributeType"
                        value={modifiedType}
                        onChange={this.handleAttributeTypeChange}
                      >
                        {types.map(type => (
                          <MenuItem key={type.id} value={type.name}>
                            {type.id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className={classes.divCenter}>
                    <IconButton
                      aria-label="done"
                      className={classes.margin}
                      onClick={this.handleDoneClick}
                    >
                      <DoneOutlinedIcon />
                    </IconButton>
                  </div>
                </Collapse>
                <div className={classes.divCenter}>
                  <Button
                    className={classes.button}
                    onClick={this.handleRenameClick}
                  >
                    Rename
                  </Button>
                  {/*
                    <Button
                    className={classes.button}
                    onClick={this.handleTypeChangeClick}
                  >
                    Change type
                  </Button>
                  */}

                  <Button
                    className={classes.button}
                    onClick={this.handleDeleteClick}
                  >
                    Delete
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Collapse>
        </div>
      </div>
    );
  }
}

Modify.propTypes = {
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

const ModifyMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Modify);

export default withStyles(styles)(ModifyMapped);
