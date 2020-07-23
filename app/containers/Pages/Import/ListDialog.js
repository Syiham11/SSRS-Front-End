import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Radio from '@material-ui/core/Radio';
import styles from './import-jss';

const fileRows = [
  {
    name: 'weatherData',
    path: 'C:/Users/Haroun-Darjaj/Documents/weatherData.txt',
    size: '12 MB',
    type: 'Text'
  },
  {
    name: 'covid19',
    path: 'C:/Users/Haroun-Darjaj/Documents/data/covid19.xlns',
    size: '1.5 MB',
    type: 'Excel'
  },
  {
    name: 'contacts',
    path: 'C:/Users/Haroun-Darjaj/Documents/contacts.csv',
    size: '800 KB',
    type: 'CSV'
  }
];

function ListDialog(props) {
  const {
    onClose,
    open,
    classes,
    importType,
    handleDialogOk,
    historyData,
    handleDeleteSource
  } = props;
  const [radioChoosedIndex, setRadioChoosedIndex] = React.useState(-1);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    handleDialogOk(radioChoosedIndex);
    onClose();
  };

  const handleRadioChoose = event => {
    setRadioChoosedIndex(event.target.value);
  };

  const chooseTable = () => {
    if (importType === 'File') {
      return (
        <Table aria-label="Choose file">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>File name</TableCell>
              <TableCell align="left">Path</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fileRows.map(row => (
              <TableRow key={row.name}>
                <TableCell align="center" scope="row">
                  <Radio checked={false} value="a" name="radio-button-demo" />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.path}</TableCell>
                <TableCell align="right">{row.size}</TableCell>
                <TableCell align="right">{row.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    if (importType === 'Database') {
      return (
        <Table aria-label="Choose database">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Database Name</TableCell>
              <TableCell align="left">Host</TableCell>
              <TableCell align="right">Port</TableCell>
              <TableCell align="right">Database Type</TableCell>
              <TableCell align="right">Username</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData.map((row, index) => (
              <TableRow key={row.name}>
                <TableCell align="center" scope="row">
                  <Radio
                    value={index}
                    name="radio-button-demo"
                    onChange={handleRadioChoose}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.databaseName}
                </TableCell>
                <TableCell align="left">{row.host}</TableCell>
                <TableCell align="right">{row.port}</TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="left">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteSource(row)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    return <div />;
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="lg"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      classes={{
        paper: classes.paper
      }}
    >
      <DialogTitle id="confirmation-dialog-title">
        {'Choose ' + importType + ' source'}
      </DialogTitle>
      <DialogContent>{chooseTable()}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ListDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  importType: PropTypes.string.isRequired,
  historyData: PropTypes.string.isRequired,
  handleDialogOk: PropTypes.func.isRequired,
  handleDeleteSource: PropTypes.func.isRequired
};

export default withStyles(styles)(ListDialog);
