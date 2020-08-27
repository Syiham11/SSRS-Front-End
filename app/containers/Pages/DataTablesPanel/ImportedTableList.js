import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  IconButton,
  Typography,
  Tooltip,
  withStyles,
  Dialog,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ImportedTableServices from '../../Services/importedTable';
import styles from '../Import/import-jss';
import StrippedTable from '../Table/StrippedTable';
import DatawarehouseServices from '../../Services/datawarehouse';

class ImportedTableList extends Component {
  state = {
    userImportedTables: [],
    allImportedTables: [],
    data: [],
    isViewData: false,
    isSpinnerShowed: false,
    choosedTableName: ''
  };

  componentDidMount() {
    this.updateTablesList();
  }

  updateTablesList = () => {
    ImportedTableServices.getUserTables().then(response => {
      this.setState({
        userImportedTables: response.data
      });
    });
    ImportedTableServices.getAll().then(response => {
      this.setState({
        allImportedTables: response.data
      });
    });
  };

  handleDeleteimportedTable = importedTable => {
    ImportedTableServices.delete(importedTable.tableId).then(() => {
      this.updateTablesList();
    });
  };

  formatDate = dateString => {
    const date = new Date(dateString);
    let toString = date.toISOString(date);
    toString = toString
      .substring(0, 10)
      .concat(' ')
      .concat(toString.substring(11, 16));
    return toString;
  };

  handleCloseDialog = () => {
    this.setState({
      isViewData: false,
      data: [],
      choosedTableName: ''
    });
  };

  handleViewData = table => {
    this.setState({
      isViewData: true,
      isSpinnerShowed: true,
      choosedTableName: table.name
    });
    DatawarehouseServices.getData(table.name).then(response => {
      this.setState({
        isSpinnerShowed: false,
        data: response.data
      });
    });
  };

  render() {
    const {
      userImportedTables,
      allImportedTables,
      isViewData,
      data,
      isSpinnerShowed,
      choosedTableName
    } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          maxWidth="xl"
          fullWidth
          aria-labelledby="viewData"
          open={isViewData}
          onClose={this.handleCloseDialog}
        >
          <DialogTitle id="alert-dialog-title">{`Data Table: ${choosedTableName}`}</DialogTitle>
          <DialogContent>
            <div
              style={{
                minHeight: '400px'
              }}
            >
              {isSpinnerShowed ? (
                <img
                  src="/images/spinner.gif"
                  alt="spinner"
                  className={classes.circularProgress}
                />
              ) : (
                <div />
              )}
              <StrippedTable overflowX tableData={data} />
            </div>
          </DialogContent>
        </Dialog>
        <Typography variant="h6" color="primary" style={{ marginBottom: 25 }}>
          My imported tables
        </Typography>
        <Table aria-label="userImportedTables">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Creation time</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {userImportedTables.map((row, index) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">
                  {this.formatDate(row.creationTime)}
                </TableCell>
                <TableCell align="right" scope="row">
                  <Tooltip title="View data">
                    <IconButton
                      aria-label="viewData"
                      value={index}
                      onClick={() => this.handleViewData(row)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete importedTable">
                    <IconButton
                      aria-label="deleteimportedTable"
                      value={index}
                      onClick={() => this.handleDeleteimportedTable(row)}
                      color="primary"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography
          variant="h6"
          color="primary"
          style={{ marginTop: 60, marginBottom: 25 }}
        >
          All tables imported in system
        </Typography>
        <Table aria-label="userImportedTables">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Creation time</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {allImportedTables.map((row, index) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">
                  {this.formatDate(row.creationTime)}
                </TableCell>
                <TableCell align="right" scope="row">
                  <Tooltip title="View data">
                    <IconButton
                      aria-label="viewData"
                      value={index}
                      onClick={() => this.handleViewData(row)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

ImportedTableList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImportedTableList);
