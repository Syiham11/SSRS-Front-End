import React, { Component } from 'react';
import { withStyles, Button, Collapse } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  undoData,
  redoData,
  clearDataHistory,
  setData
} from 'dan-actions/importedDataActions';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import UndoOutlinedIcon from '@material-ui/icons/UndoOutlined';
import RedoOutlinedIcon from '@material-ui/icons/RedoOutlined';
import SettingsBackupRestoreOutlinedIcon from '@material-ui/icons/SettingsBackupRestoreOutlined';
import Calcul from './Calcul';
import styles from './import-jss';
import Modify from './Modify';
import Filter from './Filter';

class ModifyData extends Component {
  state = {
    isModify: false,
    isFilter: false,
    isFormula: false
  };

  componentDidMount() {
    const { onClear } = this.props;
    onClear();
  }

  handleModifyClick = () => {
    const { isModify } = this.state;
    this.setState({
      isModify: !isModify,
      isFilter: false,
      isFormula: false
    });
  };

  handleFilterDataClick = () => {
    const { isFilter } = this.state;
    this.setState({
      isFilter: !isFilter,
      isModify: false,
      isFormula: false
    });
  };

  handleFormulaClick = () => {
    const { isFormula } = this.state;
    this.setState({
      isFormula: !isFormula,
      isFilter: false,
      isModify: false
    });
  };

  handleRestoreClick = () => {
    const { setTableData, originalData, onClear } = this.props;
    setTableData(originalData);
    onClear();
  };

  render() {
    const {
      classes, canUndo, canRedo, onUndo, onRedo, id
    } = this.props;
    const { isModify, isFilter, isFormula } = this.state;
    return (
      <div>
        <div className={classes.divCenter}>
          <Button
            endIcon={
              isModify ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />
            }
            className={
              isModify ? classes.buttonMenuSelected : classes.buttonMenu
            }
            onClick={this.handleModifyClick}
          >
            Modify
          </Button>
          <Button
            endIcon={
              isFilter ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />
            }
            className={
              isFilter ? classes.buttonMenuSelected : classes.buttonMenu
            }
            onClick={this.handleFilterDataClick}
          >
            Filter
          </Button>
          <Button
            endIcon={
              isFormula ? (
                <ExpandLessOutlinedIcon />
              ) : (
                <ExpandMoreOutlinedIcon />
              )
            }
            className={
              isFormula ? classes.buttonMenuSelected : classes.buttonMenu
            }
            onClick={this.handleFormulaClick}
          >
            Formula
          </Button>
        </div>
        <Collapse in={isModify}>
          <Modify id={id} />
        </Collapse>
        <Collapse in={isFilter}>
          <Filter id={id} />
        </Collapse>
        <Collapse in={isFormula}>
          <Calcul id={id} />
        </Collapse>
        <div
          className={classes.divSpace}
          style={{ marginTop: 20, width: '25%' }}
        >
          <Button
            endIcon={<UndoOutlinedIcon />}
            onClick={onUndo}
            disabled={!canUndo}
            className={classes.buttonLink}
          >
            undo
          </Button>
          <Button
            endIcon={<RedoOutlinedIcon />}
            onClick={onRedo}
            disabled={!canRedo}
            className={classes.buttonLink}
          >
            redo
          </Button>
          <Button
            endIcon={<SettingsBackupRestoreOutlinedIcon />}
            onClick={this.handleRestoreClick}
            className={classes.buttonLink}
          >
            restore data
          </Button>
        </div>
      </div>
    );
  }
}

ModifyData.propTypes = {
  classes: PropTypes.object.isRequired,
  canUndo: PropTypes.bool.isRequired,
  canRedo: PropTypes.bool.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
  originalData: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  canUndo: state.get(`importedData${ownProps.id}`).past.length > 0,
  canRedo: state.get(`importedData${ownProps.id}`).future.length > 0,
  originalData: state.get(`importedData${ownProps.id}`).present.toJS()
    .originalData
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onUndo: bindActionCreators(() => undoData(ownProps.id), dispatch),
  onRedo: bindActionCreators(() => redoData(ownProps.id), dispatch),
  onClear: bindActionCreators(() => clearDataHistory(ownProps.id), dispatch),
  setTableData: bindActionCreators(data => setData(data, ownProps.id), dispatch)
});

const ModifyDataMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyData);
export default withStyles(styles)(ModifyDataMapped);
