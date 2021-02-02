import React from 'react';
import { PapperBlock } from 'dan-components';
import PropTypes from 'prop-types';
import {
  Stepper,
  Step,
  StepLabel,
  withStyles,
  Button,
  Icon,
  Collapse,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setData,
  setOriginalData,
  clearDataHistory
} from 'dan-actions/importedDataActions';
import ImportBlock from './ImportBlock';
import ImportFile from './ImportFile';
import ImportDatabase from './ImportDatabase';
import ImportWebservice from './ImportWebservice';
import ModifyBlock from './ModifyBlock';
import MergeBlock from './MergeBlock';
import StrippedTable from '../Table/StrippedTable';
import StrippedTable2 from '../Table/StrippedTable2';
import ProcessDone from './ProcessDone';
import DatawarehouseServices from '../../Services/datawarehouse';
import ImportedTableServices from '../../Services/importedTable';
import styles from './import-jss';

class ImportComponent extends React.Component {
  state = {
    isStepperVisible: false,
    importType: '',
    activeStep: 0,
    isMergingTable: false,
    data: [],
    isLoadData: true,
    openTableName: false,
    inputTableName: ''
  };

  componentDidMount() {
    const { tableName } = this.props;
    this.setState({
      inputTableName: tableName
    });
  }

  componentWillUnmount() {
    const { setTableData, setTableOriginalData, onClear } = this.props;
    setTableData([]);
    setTableOriginalData([]);
    onClear();
  }

  setImportType = type => {
    this.setState({ importType: type });
  };

  showMergedTable = bool => {
    this.setState({ isMergingTable: bool });
  };

  getSteps = () => ['Import', 'Modify', 'Merge'];

  showStepper = () => {
    this.setState({
      isStepperVisible: true
    });
  };

  handleNext = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1
    });
  };

  handleFinish = () => {
    this.setState({
      openTableName: true
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      isStepperVisible: false
    });
  };

  handleSetData = data => {
    this.setState({
      data
    });
  };

  showImportData = () => {
    const { isStepperVisible } = this.state;
    if (!isStepperVisible) {
      return true;
    }
    return false;
  };

  showImportFile = () => {
    const { activeStep, isStepperVisible, importType } = this.state;
    if (isStepperVisible && importType === 'File' && activeStep === 0) {
      return true;
    }
    return false;
  };

  showImportDatabase = () => {
    const { activeStep, isStepperVisible, importType } = this.state;
    if (isStepperVisible && importType === 'Database' && activeStep === 0) {
      return true;
    }
    return false;
  };

  showImportWebservice = () => {
    const { activeStep, isStepperVisible, importType } = this.state;
    if (isStepperVisible && importType === 'Webservice' && activeStep === 0) {
      return true;
    }
    return false;
  };

  showModifyBlock = () => {
    const { activeStep, isStepperVisible } = this.state;
    if (isStepperVisible && activeStep === 1) {
      return true;
    }
    return false;
  };

  showMergeBlock = () => {
    const { activeStep, isStepperVisible } = this.state;
    if (isStepperVisible && activeStep === 2) {
      return true;
    }
    return false;
  };

  showProcessDone = () => {
    const { activeStep, isStepperVisible } = this.state;
    if (isStepperVisible && activeStep === 3) {
      return true;
    }
    return false;
  };

  loadData = () => {
    const { inputTableName } = this.state;
    const {
      tableData,
      originalData,
      setTableData,
      setTableOriginalData,
      onClear
    } = this.props;

    const importedTable = {
      name: inputTableName,
      creationTime: new Date()
    };

    const importedTable2 = {
      name: inputTableName.concat('_original'),
      creationTime: new Date()
    };

    ImportedTableServices.save(importedTable).then(() => {
      ImportedTableServices.save(importedTable2);
    });

    DatawarehouseServices.loadData(inputTableName, tableData);

    DatawarehouseServices.loadData(
      inputTableName.concat('_original'),
      originalData
    ).then(response => {
      console.log(response);
      setTimeout(() => {
        setTableData([]);
        setTableOriginalData([]);
        onClear();
        this.setState({
          isLoadData: false
        });
      }, 5000);
    });
  };

  handleDialogClose = () => {
    this.setState({
      openTableName: false
    });
  };

  handleTableName = event => {
    this.setState({
      inputTableName: event.target.value
    });
  };

  handleDone = () => {
    this.setState(
      {
        openTableName: false
      },
      () => {
        this.loadData();
        this.handleNext();
      }
    );
  };

  render() {
    const {
      activeStep,
      isStepperVisible,
      isMergingTable,
      data,
      isLoadData,
      openTableName,
      inputTableName
    } = this.state;
    const {
      classes, id, hidden, tableData
    } = this.props;
    const steps = this.getSteps();

    return (
      <div hidden={hidden}>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="setTableName"
          open={openTableName}
          classes={{
            paper: classes.paper
          }}
        >
          <DialogTitle id="SaveFormula">Set table name</DialogTitle>
          <DialogContent>
            <TextField
              id="outlined-basic"
              label="Insert Name"
              variant="outlined"
              value={inputTableName}
              fullWidth
              onChange={this.handleTableName}
              className={classes.textField}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleDone} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
        <Slide
          direction="down"
          in={isStepperVisible}
          style={{ transitionDelay: isStepperVisible ? '500ms' : '0ms' }}
          mountOnEnter
          unmountOnExit
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            style={{ backgroundColor: 'transparent' }}
          >
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Slide>
        <Slide
          direction="right"
          in={this.showImportData()}
          style={{ transitionDelay: this.showImportData() ? '500ms' : '0ms' }}
          mountOnEnter
          unmountOnExit
        >
          <PapperBlock
            title="Import Data"
            whiteBg
            icon="ios-cloud-upload-outline"
            desc="Choose a data source."
          >
            <div>
              <ImportBlock
                setImportType={this.setImportType}
                showStepper={this.showStepper}
              />
            </div>
          </PapperBlock>
        </Slide>
        <Slide
          direction="right"
          in={this.showImportFile()}
          style={{ transitionDelay: this.showImportFile() ? '500ms' : '0ms' }}
          mountOnEnter
          unmountOnExit
        >
          <PapperBlock
            title="Import File"
            whiteBg
            icon="ios-cloud-upload-outline"
            desc="Upload a file to import data."
          >
            <div>
              {<ImportFile id={id} handleNext={this.handleNext} /> || <div />}
            </div>
          </PapperBlock>
        </Slide>
        <Slide
          direction="right"
          in={this.showImportDatabase()}
          style={{
            transitionDelay: this.showImportDatabase() ? '500ms' : '0ms'
          }}
          mountOnEnter
          unmountOnExit
        >
          <PapperBlock
            title="Import Database"
            whiteBg
            icon="ios-cloud-upload-outline"
            desc="Insert database configuration to import data."
          >
            <div>
              {<ImportDatabase id={id} handleNext={this.handleNext} /> || (
                <div />
              )}
            </div>
          </PapperBlock>
        </Slide>
        <Slide
          direction="right"
          in={this.showImportWebservice()}
          style={{
            transitionDelay: this.showImportWebservice() ? '500ms' : '0ms'
          }}
          mountOnEnter
          unmountOnExit
        >
          <PapperBlock
            title="Import Webservice"
            whiteBg
            icon="ios-cloud-upload-outline"
            desc="Insert webservice configuration to import data."
          >
            <div>
              <ImportWebservice handleNext={this.handleNext} />
            </div>
          </PapperBlock>
        </Slide>
        <Slide
          direction="right"
          in={this.showModifyBlock()}
          style={{ transitionDelay: this.showModifyBlock() ? '500ms' : '0ms' }}
          mountOnEnter
          unmountOnExit
        >
          <PapperBlock
            title="Modify Data"
            whiteBg
            icon="ios-settings-outline"
            desc="Modify data using several operations."
          >
            <div>
              <ModifyBlock id={id} />
              <StrippedTable overflowX tableData={tableData} />
            </div>
            <div className={classes.divSpace}>
              <Button className={classes.buttonLink} onClick={this.handleBack}>
                <Icon className={classes.icon}>arrow_backward</Icon>
                Back
              </Button>
              <Button className={classes.buttonLink} onClick={this.handleNext}>
                Next
                <Icon className={classes.icon}>arrow_forward</Icon>
              </Button>
            </div>
          </PapperBlock>
        </Slide>
        <Slide
          direction="right"
          in={this.showMergeBlock()}
          style={{ transitionDelay: this.showMergeBlock() ? '500ms' : '0ms' }}
          mountOnEnter
          unmountOnExit
        >
          <PapperBlock
            title="Merge Data"
            whiteBg
            icon="ios-settings-outline"
            desc="Choose a table to merge it with your current data, make sure that the two tables have the same attributes for the vertical merge, or one commun attribute for the horizontal merge."
          >
            <div>
              <StrippedTable overflowX tableData={tableData} />
              <MergeBlock
                showMergedTable={this.showMergedTable}
                handleSetData={this.handleSetData}
                id={id}
              />
              <Collapse in={isMergingTable}>
                <StrippedTable2 data={data} />
              </Collapse>
            </div>
            <div className={classes.divSpace}>
              <Button className={classes.buttonLink} onClick={this.handleBack}>
                <Icon className={classes.icon}>arrow_backward</Icon>
                Back
              </Button>
              <Button
                className={classes.buttonLink}
                onClick={this.handleFinish}
              >
                Finish
                <Icon className={classes.icon}>arrow_forward</Icon>
              </Button>
            </div>
          </PapperBlock>
        </Slide>
        <Slide
          direction="right"
          in={this.showProcessDone()}
          style={{ transitionDelay: this.showProcessDone() ? '500ms' : '0ms' }}
          mountOnEnter
          unmountOnExit
        >
          <ProcessDone isLoadData={isLoadData} />
        </Slide>
      </div>
    );
  }
}

ImportComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  hidden: PropTypes.bool.isRequired,
  onClear: PropTypes.func.isRequired,
  tableData: PropTypes.array.isRequired,
  originalData: PropTypes.array.isRequired,
  setTableData: PropTypes.func.isRequired,
  setTableOriginalData: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  tableData: state.get(`importedData${ownProps.id}`).present.toJS().tableData,
  originalData: state.get(`importedData${ownProps.id}`).present.toJS()
    .originalData,
  tableName: state.get(`importedData${ownProps.id}`).present.toJS().tableName
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClear: bindActionCreators(() => clearDataHistory(ownProps.id), dispatch),
  setTableData: bindActionCreators(
    data => setData(data, ownProps.id),
    dispatch
  ),
  setTableOriginalData: bindActionCreators(
    data => setOriginalData(data, ownProps.id),
    dispatch
  )
});

const ImportComponentMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportComponent);

export default withStyles(styles)(ImportComponentMapped);
