import React, { Component } from 'react';
import {
  withStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setData } from 'dan-actions/importedDataActions';
import styles from './import-jss';
import AlgorithmBlock from './algorithmBlock';
import AlgorithmsServices from '../../Services/algorithm';

class Calcul extends Component {
  state = {
    isSpinnerShowed: false
  };

  handleApplyAlgorithm = (info) => {
    const { currentAlgorithm } = info;
    const { tableData, setTableData } = this.props;
    const al = {
      formula: currentAlgorithm.algo.algoFormula,
      type: currentAlgorithm.algo.algoType,
      variables: currentAlgorithm.variables
    };
    console.log(al);
    let variables = '';
    currentAlgorithm.variables.forEach(v => {
      variables = variables.concat(v.value + '-');
    });
    AlgorithmsServices.ApplyAlgorithm(tableData, currentAlgorithm.result, currentAlgorithm.algo.algoId, variables).then(result => {
      setTableData(result.data);
    });
  }

  render() {
    const {
      isSpinnerShowed,
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
          <AlgorithmBlock columns={keys} applyFunction={this.handleApplyAlgorithm} />
        </div>
      </div>
    );
  }
}

Calcul.propTypes = {
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

const CalculMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Calcul);

export default withStyles(styles)(CalculMapped);
