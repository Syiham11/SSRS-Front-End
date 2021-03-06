import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  withStyles,
  IconButton,
  Grid,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
import Ionicon from 'react-ionicons';
import ListDialog from './ListDialog';
import ImportServices from '../../Services/import';
import styles from './import-jss';

const fileTypes = [
  { id: 'Excel', extension: 'XLSX' },
  { id: 'CSV', extension: 'CSV' },
  { id: 'XML', extension: 'XML' },
  { id: 'Text', extension: 'TXT' }
];

const separators = [
  { id: 'Comma', name: 'Comma' },
  { id: 'Semicolon', name: 'Semicolon' },
  { id: 'Point', name: 'Point' }
];

const inputFile = React.createRef();
const reader = new FileReader();

class ImportFile extends Component {
  state = {
    selectedFileType: '',
    separator: '',
    selectedFileName: 'Browse files',
    dialogOpen: false,
    dialogValue: '',
    file: {},
    sheetNumber: 0,
    headerLine: 1,
    csvHeaderState: '',
    isImport: false
  };

  handleFileTypeChange = event => {
    this.setState({ selectedFileType: event.target.value });
    console.log(event.target.value);
  };

  handleSeparatorChange = event => {
    this.setState({ separator: event.target.value });
  };

  handleUploadClick = () => {
    inputFile.current.click();
  };

  handleChange = () => {
    this.setState({
      selectedFileName: inputFile.current.files[0].name,
      file: inputFile.current.files[0]
    });
    console.log(inputFile.current.files[0].name);
    console.log(reader.readAsDataURL(inputFile.current.files[0]));
  };

  handleImportClick = () => {
    const {
      file,
      selectedFileType,
      csvHeaderState,
      sheetNumber,
      headerLine,
      separator
    } = this.state;
    const {
      handleNext,
      setTableData,
      setTableOriginalData,
      setTableName
    } = this.props;
    this.setState({
      isImport: true
    });
    const data = new FormData();
    data.append('file', file, file.name);
    const config = {
      headers: {
        Authorization: sessionStorage.getItem('token'),
        'content-type': 'multipart/form-data;boundary=gc0p4Jq0M2Yt08jU534c0p'
      }
    };
    if (selectedFileType === 'XLSX') {
      ImportServices.extractExcelData(data, sheetNumber, headerLine, config)
        .then(response => {
          console.log(response.data);
          setTableData(response.data);
          setTableOriginalData(response.data);
          setTableName(file.name);
          setTimeout(() => {
            this.setState({
              isImport: false
            });
            handleNext();
          }, 500);
        })
        .catch(() => {
          this.setState({
            isImport: false
          });
        });
    } else if (selectedFileType === 'CSV') {
      ImportServices.extractCsvData(data, csvHeaderState, config)
        .then(response => {
          console.log(response.data);
          setTableData(response.data);
          setTableOriginalData(response.data);
          setTableName(file.name);
          setTimeout(() => {
            handleNext();
          }, 500);
        })
        .catch(() => {
          this.setState({
            isImport: false
          });
        });
    } else if (selectedFileType === 'XML') {
      ImportServices.extractXmlData(data, config)
        .then(response => {
          let dataResponse = response.data;
          let bool = true;
          while (bool) {
            dataResponse = dataResponse[Object.keys(dataResponse)[0]];

            if (Object.keys(dataResponse).length > 1) {
              bool = false;
            }
          }
          console.log(dataResponse);
          setTableData(dataResponse);
          setTableOriginalData(dataResponse);
          setTableName(file.name);
          setTimeout(() => {
            handleNext();
          }, 500);
        })
        .catch(() => {
          this.setState({
            isImport: false
          });
        });
    } else if (selectedFileType === 'TXT') {
      let separatorCoded = null;
      if (separator === 'Comma') {
        separatorCoded = encodeURIComponent(',');
      } else if (separator === 'Semicolon') {
        separatorCoded = encodeURIComponent(';');
      } else {
        separatorCoded = encodeURIComponent('.');
      }
      separatorCoded = separatorCoded.slice(1, separatorCoded.length);
      ImportServices.extractTxtData(
        data,
        csvHeaderState,
        separatorCoded,
        config
      )
        .then(response => {
          console.log(response.data);
          setTableData(response.data);
          setTableOriginalData(response.data);
          setTableName(file.name);
          setTimeout(() => {
            handleNext();
          }, 500);
        })
        .catch(() => {
          this.setState({
            isImport: false
          });
        });
    } else if (selectedFileType === 'DWG') {
      ImportServices.extractDwgData(data, config)
        .then(response => {
          console.log(response.data);
          this.setState({
            isImport: false
          });
        })
        .catch(() => {
          this.setState({
            isImport: false
          });
        });
    }
  };

  handleClickListItem = () => {
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

  handleSheetNumberChange = event => {
    this.setState({
      sheetNumber: event.target.value
    });
  };

  handleHeaderLineChange = event => {
    this.setState({
      headerLine: event.target.value
    });
  };

  handleChangeCsvHeaderState = e => {
    this.setState({
      csvHeaderState: e.target.value
    });
  };

  render() {
    const {
      selectedFileType,
      separator,
      selectedFileName,
      dialogOpen,
      dialogValue,
      sheetNumber,
      headerLine,
      csvHeaderState,
      isImport
    } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Grid
          container
          spacing={10}
          alignItems="flex-start"
          direction="row"
          justify="center"
        >
          {isImport ? (
            <Grid item xs={12} md={5}>
              <div>
                <LinearProgress style={{ marginTop: 50 }} />
                <div className={classes.divCenter}>
                  <Typography variant="subtitle1" className={classes.subtitle}>
                    Please wait while fetching your data...
                  </Typography>
                </div>
              </div>
            </Grid>
          ) : (
            <Grid item xs={12} md={7}>
              <Grid container spacing={2} alignItems="center" justify="center">
                <Grid item xs={7}>
                  <FormControl
                    className={classes.formControl}
                    fullWidth
                    required
                  >
                    <InputLabel>File type</InputLabel>
                    <Select
                      name="fileType"
                      value={selectedFileType}
                      onChange={this.handleFileTypeChange}
                    >
                      {fileTypes.map(file => (
                        <MenuItem key={file.id} value={file.extension}>
                          {file.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {selectedFileType === 'XLSX' ? (
                  <Grid item xs={7}>
                    <TextField
                      label="Sheet number"
                      variant="outlined"
                      name="sheetNumber"
                      value={sheetNumber}
                      type="number"
                      className={classes.textField}
                      style={{
                        width: '50%'
                      }}
                      onChange={this.handleSheetNumberChange}
                    />
                    <TextField
                      label="Header line"
                      variant="outlined"
                      name="headerLine"
                      value={headerLine}
                      type="number"
                      className={classes.textField}
                      style={{
                        width: '50%'
                      }}
                      onChange={this.handleHeaderLineChange}
                    />
                  </Grid>
                ) : (
                  <div />
                )}
                {selectedFileType === 'CSV' ? (
                  <Grid item xs={7}>
                    <div className={classes.divCenter}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          CSV file contains header?
                        </FormLabel>
                        <RadioGroup
                          aria-label="csvHeader"
                          name="csvHeader"
                          value={csvHeaderState}
                          onChange={this.handleChangeCsvHeaderState}
                          row
                          className={classes.divCenter}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </Grid>
                ) : (
                  <div />
                )}
                {selectedFileType === 'TXT' ? (
                  <Grid item xs={7}>
                    <div className={classes.divCenter}>
                      <FormControl
                        className={classes.formControl}
                        fullWidth
                        required
                      >
                        <InputLabel>Separator</InputLabel>
                        <Select
                          name="separator"
                          value={separator}
                          onChange={this.handleSeparatorChange}
                        >
                          {separators.map(sep => (
                            <MenuItem key={sep.id} value={sep.name}>
                              {sep.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className={classes.divCenter}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          Text file contains header?
                        </FormLabel>
                        <RadioGroup
                          aria-label="csvHeader"
                          name="csvHeader"
                          value={csvHeaderState}
                          onChange={this.handleChangeCsvHeaderState}
                          row
                          className={classes.divCenter}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </Grid>
                ) : (
                  <div />
                )}
              </Grid>
              <div className={classes.divCenter}>
                <IconButton
                  color="primary"
                  classes={{
                    root: classes.iconRoot,
                    label: classes.iconButton
                  }}
                  onClick={this.handleUploadClick}
                >
                  <input
                    type="file"
                    id="file"
                    accept={'.' + selectedFileType}
                    ref={inputFile}
                    style={{ display: 'none' }}
                    onChange={this.handleChange}
                  />
                  <Ionicon icon="ios-cloud-upload-outline" />
                  <div>{selectedFileName}</div>
                </IconButton>
              </div>
              {/* <div className={classes.divCenter}>
                <Button
                  size="small"
                  className={classes.buttonLink}
                  onClick={this.handleClickListItem}
                >
                  Choose a file from history
                </Button>
                </div> */}
              <ListDialog
                keepMounted
                open={dialogOpen}
                onClose={this.handleClose}
                value={dialogValue}
                importType="File"
              />
              <div className={classes.divCenter}>
                <Button
                  className={classes.button}
                  onClick={this.handleImportClick}
                  style={{ width: '25%' }}
                >
                  Import
                </Button>
              </div>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

ImportFile.propTypes = {
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

const ImportFileMapped = connect(
  null,
  mapDispatchToProps
)(ImportFile);

export default withStyles(styles)(ImportFileMapped);
