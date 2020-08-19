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
  Grid
} from '@material-ui/core';
import Ionicon from 'react-ionicons';
import ListDialog from './ListDialog';
import styles from './import-jss';

const fileTypes = [
  { id: 'Excel', extension: 'xlsx' },
  { id: 'CSV', extension: 'CSV' },
  { id: 'XML', extension: 'XML' },
  { id: 'Text', extension: 'TXT' },
  { id: 'Autocad', extension: 'DWG' },
  { id: 'Arcview', extension: 'SHP' }
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
    selectedSeparator: '',
    selectedFileName: 'Browse files',
    dialogOpen: false,
    dialogValue: ''
  };

  handleFileTypeChange = event => {
    this.setState({ selectedFileType: event.target.value });
  };

  handleSeparatorChange = event => {
    this.setState({ selectedSeparator: event.target.value });
  };

  handleUploadClick = () => {
    inputFile.current.click();
  };

  handleChange = () => {
    this.setState({ selectedFileName: inputFile.current.files[0].innerHTML });
    console.log(reader.readAsDataURL(inputFile.current.files[0]));
  };

  handleImportClick = () => {
    const { handleNext } = this.props;
    handleNext();
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

  render() {
    const {
      selectedFileType,
      selectedSeparator,
      selectedFileName,
      dialogOpen,
      dialogValue
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
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} alignItems="center" justify="center">
              <Grid item xs={6}>
                <FormControl className={classes.formControl} fullWidth required>
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
              <Grid item xs={6}>
                <FormControl className={classes.formControl} fullWidth required>
                  <InputLabel>Separator</InputLabel>
                  <Select
                    name="separator"
                    value={selectedSeparator}
                    onChange={this.handleSeparatorChange}
                  >
                    {separators.map(separator => (
                      <MenuItem key={separator.id} value={separator.name}>
                        {separator.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <div className={classes.divCenter}>
              <IconButton
                color="primary"
                classes={{ root: classes.iconRoot, label: classes.iconButton }}
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
            <div className={classes.divCenter}>
              <Button
                size="small"
                className={classes.buttonLink}
                onClick={this.handleClickListItem}
              >
                Choose a file from history
              </Button>
            </div>
            <ListDialog
              keepMounted
              open={dialogOpen}
              onClose={this.handleClose}
              value={dialogValue}
              importType="File"
            />
          </Grid>
        </Grid>
        <div className={classes.divCenter}>
          <Button className={classes.button} onClick={this.handleImportClick}>
            Import
          </Button>
        </div>
      </div>
    );
  }
}

ImportFile.propTypes = {
  classes: PropTypes.object.isRequired,
  handleNext: PropTypes.func.isRequired
};

export default withStyles(styles)(ImportFile);
