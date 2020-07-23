import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './import-jss';

class ImportBlock extends Component {
  handleShow = title => {
    const { setImportType, showStepper } = this.props;
    setImportType(title);
    showStepper();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.divCenter}>
        <Button
          className={classes.button}
          onClick={() => this.handleShow('File')}
        >
          File
        </Button>
        <Button
          className={classes.button}
          onClick={() => this.handleShow('Database')}
        >
          Database
        </Button>
        <Button
          className={classes.button}
          onClick={() => this.handleShow('Webservice')}
        >
          Webservice
        </Button>
      </div>
    );
  }
}

ImportBlock.propTypes = {
  classes: PropTypes.object.isRequired,
  setImportType: PropTypes.func.isRequired,
  showStepper: PropTypes.func.isRequired
};

export default withStyles(styles)(ImportBlock);
