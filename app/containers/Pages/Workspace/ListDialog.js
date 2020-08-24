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
import styles from '../Import/import-jss';

function ListDialog(props) {
  const {
    onClose,
    open,
    classes,
    handleDialogOk,
    historyData,
    handleDeleteTemplate
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

  const chooseTable = () => (
    <Table aria-label="Choose template">
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Template Name</TableCell>
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
              {row.name}
            </TableCell>
            <TableCell align="left">
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteTemplate(row)}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="md"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      classes={{
        paper: classes.paper
      }}
    >
      <DialogTitle id="confirmation-dialog-title">
        {'Choose Template'}
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
  historyData: PropTypes.string.isRequired,
  handleDialogOk: PropTypes.func.isRequired,
  handleDeleteTemplate: PropTypes.func.isRequired
};

export default withStyles(styles)(ListDialog);
