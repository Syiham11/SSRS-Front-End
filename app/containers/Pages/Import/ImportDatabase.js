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
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
  Collapse,
  Icon,
  InputAdornment,
  IconButton,
  LinearProgress,
  Typography
} from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setData,
  setOriginalData,
  setName
} from 'dan-actions/importedDataActions';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined';
import PropTypes from 'prop-types';
import axios from 'axios';
import ImportServices from '../../Services/import';
import ListDialog from './ListDialog';
import styles from './import-jss';

const databases = [
  { id: 'SQLServer', name: 'Microsoft SQL Server' },
  { id: 'MySQL', name: 'MySQL' },
  { id: 'PostgreSQL', name: 'PostgreSQL' },
  { id: 'Oracle', name: 'Oracle' },
  { id: 'MongoDB', name: 'MongoDB' },
  { id: 'MariaDB', name: 'MariaDB' }
];

const apiURL = 'http://localhost:9090/import/database';

class ImportDatabase extends Component {
  state = {
    selectedDatabaseType: '',
    username: '',
    password: '',
    host: '',
    port: '',
    databaseName: '',
    historyDatabaseSources: [],
    isSpinnerShowed: false,
    isOpenedDialog: false,
    isConnected: false,
    selectedTable: '',
    dialogOpen: false,
    testConnected: false,
    showPassword: false,
    listTables: [],
    isImport: false
  };

  componentDidMount() {
    this.updateHistoryList();
  }

  handleDatabaseTypeChange = event => {
    this.setState({
      selectedDatabaseType: event.target.value
    });
  };

  handleTestConnection = () => {
    const {
      username,
      password,
      host,
      port,
      databaseName,
      selectedDatabaseType
    } = this.state;
    this.setState({
      isSpinnerShowed: true
    });
    const connectionParam = {
      type: selectedDatabaseType,
      username,
      password,
      host,
      port,
      databaseName
    };
    ImportServices.testConnection(connectionParam)
      .then(response => {
        if (response.data) {
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

  handleDialogClose = () => {
    this.setState({
      isOpenedDialog: false
    });
  };

  handleTableChange = event => {
    this.setState({
      selectedTable: event.target.value
    });
  };

  handleConnect = () => {
    const {
      username, password, host, port, databaseName, selectedDatabaseType
    } = this.state;
    this.setState({
      isSpinnerShowed: true
    });
    const connectionParam = {
      userId: '1',
      type: selectedDatabaseType,
      username,
      password,
      host,
      port,
      databaseName
    };
    ImportServices.testConnection(connectionParam)
      .then(response => {
        if (response.data) {
          this.setListTables(connectionParam);
          setTimeout(() => {
            this.setState({
              isConnected: true,
              isSpinnerShowed: false
            });
          }, 1000);
        } else {
          setTimeout(() => {
            this.setState({
              isSpinnerShowed: false
            });
          }, 1000);
          alert('connection failed');
        }
      });
  };

  setListTables = connectionParam => {
    ImportServices.getTables(connectionParam).then(response => {
      this.setState({
        listTables: response.data
      });
    });
  };

  handleBack = () => {
    this.setState({
      isConnected: false
    });
  };

  handleImport = () => {
    const {
      handleNext,
      setTableData,
      setTableOriginalData,
      setTableName
    } = this.props;
    const {
      selectedTable,
      username,
      password,
      host,
      port,
      databaseName,
      selectedDatabaseType
    } = this.state;
    this.setState({
      isImport: true
    });
    const connectionParam = {
      userId: '1',
      type: selectedDatabaseType,
      username,
      password,
      host,
      port,
      databaseName
    };
    ImportServices.getData(selectedTable, connectionParam)
      .then(response => {
        const data = [];
        response.data.forEach((da) => {
          const dt = da;
          if (dt._id) {
            delete dt._id;
          }
          data.push(dt);
        });
        console.log(response);
        setTableData(data);
        setTableOriginalData(data);
        setTableName(selectedTable);
        setTimeout(() => {
          this.setState({
            isImport: false
          });
          handleNext();
        }, 500);
      });
  };

  handleOpenDialog = () => {
    this.setState({
      dialogOpen: true
    });
  };

  handleClose = () => {
    this.setState({
      dialogOpen: false
    });
  };

  handleChangeUsernameText = event => {
    this.setState({
      username: event.target.value
    });
  };

  handleChangePasswordText = event => {
    this.setState({
      password: event.target.value
    });
  };

  handleChangeHostText = event => {
    this.setState({
      host: event.target.value
    });
  };

  handleChangePortText = event => {
    this.setState({
      port: event.target.value
    });
  };

  handleChangeDatabaseNameText = event => {
    this.setState({
      databaseName: event.target.value
    });
  };

  handleClickShowPassword = () => {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleHistoryDatabaseSourcesOk = radioChoosedIndex => {
    const { historyDatabaseSources } = this.state;
    console.log('index ' + radioChoosedIndex);
    this.setState({
      selectedDatabaseType: historyDatabaseSources[radioChoosedIndex].type,
      username: historyDatabaseSources[radioChoosedIndex].username,
      password: historyDatabaseSources[radioChoosedIndex].password,
      host: historyDatabaseSources[radioChoosedIndex].host,
      port: historyDatabaseSources[radioChoosedIndex].port,
      databaseName: historyDatabaseSources[radioChoosedIndex].databaseName
    });
    this.handleDialogClose();
  };

  handleSaveDatasource = () => {
    const {
      username,
      password,
      host,
      port,
      databaseName,
      selectedDatabaseType
    } = this.state;
    const connectionParam = {
      type: selectedDatabaseType,
      username,
      password,
      host,
      port,
      databaseName
    };
    const { sub } = JSON.parse(sessionStorage.getItem('user'));
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    axios.post(apiURL + '/savesource&' + sub, connectionParam, config);
    this.updateHistoryList();
  };

  handleLoad = () => {
    this.setState({
      dialogOpen: true
    });
  };

  handleDeleteDatabaseSource = dbs => {
    console.log('delete');
    console.log(dbs);
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    axios.post(apiURL + '/deletesource', dbs, config).then(response => {
      console.log(response.data);
      this.updateHistoryList();
    });
  };

  updateHistoryList = () => {
    const { sub } = JSON.parse(sessionStorage.getItem('user'));
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    axios.get(apiURL + '/getsources&' + sub, config).then(response => {
      this.setState({
        historyDatabaseSources: response.data
      });
    });
  };

  render() {
    const {
      selectedDatabaseType,
      username,
      password,
      host,
      port,
      databaseName,
      isSpinnerShowed,
      isOpenedDialog,
      isConnected,
      selectedTable,
      dialogOpen,
      testConnected,
      showPassword,
      listTables,
      isImport,
      historyDatabaseSources
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
          <Grid
            container
            spacing={10}
            alignItems="flex-start"
            direction="row"
            justify="center"
          >
            <Grid item xs={12} md={5}>
              <Collapse in={!isConnected}>
                <Dialog
                  onClose={this.handleDialogClose}
                  aria-labelledby="simple-dialog-title"
                  open={isOpenedDialog}
                >
                  <DialogTitle id="alert-dialog-title">
                    Test connection
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <DoneOutlinedIcon />
                      {testConnected
                        ? 'Test connection succeeded'
                        : 'Test connection failed'}
                    </DialogContentText>
                  </DialogContent>
                </Dialog>
                <div className={classes.divSpace}>
                  <Button
                    size="small"
                    className={classes.buttonLink}
                    onClick={this.handleSaveDatasource}
                  >
                    Save configurations
                  </Button>
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
                  importType="Database"
                  historyData={historyDatabaseSources}
                  handleDialogOk={this.handleHistoryDatabaseSourcesOk}
                  handleDeleteSource={this.handleDeleteDatabaseSource}
                />
                <FormControl className={classes.formControl} fullWidth required>
                  <InputLabel>Database Type</InputLabel>
                  <Select
                    name="fileType"
                    value={selectedDatabaseType}
                    onChange={this.handleDatabaseTypeChange}
                  >
                    {databases.map(database => (
                      <MenuItem key={database.id} value={database.id}>
                        {database.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  id="outlined-basic"
                  label="Host"
                  variant="outlined"
                  value={host}
                  fullWidth
                  required
                  onChange={this.handleChangeHostText}
                  className={classes.textField}
                />
                <TextField
                  id="outlined-basic"
                  label="Port"
                  variant="outlined"
                  value={port}
                  fullWidth
                  required
                  onChange={this.handleChangePortText}
                  className={classes.textField}
                />
                <TextField
                  id="outlined-basic"
                  label="Database name"
                  variant="outlined"
                  value={databaseName}
                  fullWidth
                  required
                  onChange={this.handleChangeDatabaseNameText}
                  className={classes.textField}
                />
                <TextField
                  id="outlined-basic"
                  label="Username"
                  variant="outlined"
                  value={username}
                  fullWidth
                  required
                  onChange={this.handleChangeUsernameText}
                  className={classes.textField}
                />
                <TextField
                  id="outlined-basic"
                  label="Password"
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                  fullWidth
                  required
                  onChange={this.handleChangePasswordText}
                  className={classes.textField}
                />
                <div className={classes.divSpace}>
                  <Button
                    className={classes.buttonWithoutWidth}
                    onClick={this.handleTestConnection}
                  >
                    Test connection
                  </Button>
                  <Button
                    className={classes.buttonWithoutWidth}
                    onClick={this.handleConnect}
                  >
                    Connect
                  </Button>
                </div>
              </Collapse>
            </Grid>
          </Grid>
          <Collapse in={isConnected}>
            <Grid
              container
              spacing={10}
              alignItems="flex-start"
              direction="row"
              justify="center"
            >
              <Grid item xs={12} md={5}>
                {isImport ? (
                  <div>
                    <LinearProgress style={{ marginTop: 50 }} />
                    <div className={classes.divCenter}>
                      <Typography
                        variant="subtitle1"
                        className={classes.subtitle}
                      >
                        Please wait while fetching your data...
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      size="small"
                      className={classes.buttonLink}
                      onClick={this.handleBack}
                    >
                      <Icon className={classes.icon}>arrow_backward</Icon>
                      Back
                    </Button>
                    <div className={classes.divCenter}>
                      <FormControl
                        className={classes.formControl}
                        fullWidth
                        required
                      >
                        <InputLabel>Choose Table</InputLabel>
                        <Select
                          name="table"
                          value={selectedTable}
                          onChange={this.handleTableChange}
                        >
                          {listTables.map(table => (
                            <MenuItem key={table} value={table}>
                              {table}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
            {!isImport ? (
              <div className={classes.divCenter}>
                <Button className={classes.button} onClick={this.handleImport}>
                  Import
                </Button>
              </div>
            ) : (
              <div />
            )}
          </Collapse>
        </div>
      </div>
    );
  }
}

ImportDatabase.propTypes = {
  classes: PropTypes.object.isRequired,
  handleNext: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
  setTableOriginalData: PropTypes.func.isRequired,
  setTableName: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  setTableData: bindActionCreators(
    data => setData(data, ownProps.id),
    dispatch
  ),
  setTableOriginalData: bindActionCreators(
    data => setOriginalData(data, ownProps.id),
    dispatch
  ),
  setTableName: bindActionCreators(name => setName(name, ownProps.id), dispatch)
});

const ImportDatabaseMapped = connect(
  null,
  mapDispatchToProps
)(ImportDatabase);

export default withStyles(styles)(ImportDatabaseMapped);
