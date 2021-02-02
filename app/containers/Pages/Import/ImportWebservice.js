import React, { Component } from 'react';
import {
  withStyles,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Collapse
} from '@material-ui/core';
import PropTypes from 'prop-types';
import ListDialog from './ListDialog';
import styles from './import-jss';
import ImportServices from '../../Services/import';

const dataTypes = [{ id: 'JSON', name: 'JSON' }, { id: 'XML', name: 'XML' }];

class ImportWebservice extends Component {
  state = {
    selectedDataType: '',
    isSpinnerShowed: false,
    isConnected: false,
    dialogOpen: false,
    host: '',
    username: '',
    password: '',
    dialogValue: ''
  };

  handleDataTypeChange = event => {
    this.setState({
      selectedDataType: event.target.value
    });
  };

  handleTestConnection = () => {
    const {
      username,
      password,
      host,
      selectedDataType
    } = this.state;
    this.setState({
      isSpinnerShowed: true
    });
    const connectionParam = {
      userId: '1',
      type: selectedDataType,
      username,
      password,
      host
    };
    ImportServices.webServiceTest(connectionParam).then(response => {
      if (response.data) {
        console.log(response.data);
        this.setState({
          testConnected: true
        });
      } else {
        this.setState({
          testConnected: false
        });
      }
    });
    setTimeout(() => {
      this.setState({
        isSpinnerShowed: false,
        isOpenedDialog: true
      });
    }, 3000);
  };

  handleImport = () => {
    const { handleNext } = this.props;
    this.setState({
      isSpinnerShowed: true
    });
    setTimeout(() => {
      this.setState({
        isSpinnerShowed: false
      });
      handleNext();
    }, 2000);
  };

  handleLoad = () => {
    this.setState({
      dialogOpen: true
    });
  };

  handleClose = newValue => {
    this.setState({
      dialogOpen: false
    });

    if (newValue) {
      this.setState({
        dialogValue: newValue
      });
    }
  };

  handleUrlText = event => {
    this.setState({
      host: event.target.value
    });
  };

  handleUsernameText = event => {
    this.setState({
      username: event.target.value
    });
  };

  handlePasswordText = event => {
    this.setState({
      password: event.target.value
    });
  };

  render() {
    console.log(this.state);
    const {
      selectedDataType,
      isSpinnerShowed,
      isConnected,
      dialogOpen,
      dialogValue
    } = this.state;
    const { classes } = this.props;
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
          <Collapse in={!isConnected}>
            <Grid
              container
              spacing={10}
              alignItems="flex-start"
              direction="row"
              justify="center"
            >
              <Grid item xs={12} md={5}>
                <div className={classes.divRight}>
                  <Button
                    size="small"
                    className={classes.buttonLink}
                    onClick={this.handleLoad}
                  >
                    Load configuration from history
                  </Button>
                </div>
                <ListDialog
                  keepMounted
                  open={dialogOpen}
                  onClose={this.handleClose}
                  value={dialogValue}
                  importType="Webservice"
                />
                <TextField
                  id="outlined-basic"
                  label="URL"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={this.handleUrlText}
                  className={classes.textField}
                />
                <TextField
                  id="outlined-basic"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  onChange={this.handleUsernameText}
                  className={classes.textField}
                />
                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  onChange={this.handlePasswordText}
                  className={classes.textField}
                />
                <FormControl className={classes.formControl} fullWidth required>
                  <InputLabel>Data Type</InputLabel>
                  <Select
                    name="fileType"
                    value={selectedDataType}
                    onChange={this.handleDataTypeChange}
                  >
                    {dataTypes.map(dataType => (
                      <MenuItem key={dataType.id} value={dataType.name}>
                        {dataType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className={classes.divSpace}>
                  <Button
                    className={classes.buttonWithoutWidth}
                    onClick={this.handleTestConnection}
                  >
                    Test connection
                  </Button>
                  <Button className={classes.buttonWithoutWidth} onClick={this.handleImport}>
                    Import
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

ImportWebservice.propTypes = {
  classes: PropTypes.object.isRequired,
  handleNext: PropTypes.func.isRequired
};

export default withStyles(styles)(ImportWebservice);
