import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Grid,
  withStyles,
  CircularProgress,
  Typography
} from '@material-ui/core';
import Ionicon from 'react-ionicons';
// import { NavLink } from 'react-router-dom';

const styles = theme => ({
  button: {
    background: theme.palette.primary.main,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
    color: 'white',
    height: 45,
    width: '20%',
    margin: '0 0 3%',
    padding: '0 30px',
    '&:hover': {
      background: theme.palette.secondary.main
    }
  },
  divCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(15)
  },
  iconButton: {
    display: 'flex',
    flexDirection: 'column',
    height: 180,
    width: 180,
    '& svg': {
      width: '70%',
      height: '70%',
      verticalAlign: 'middle'
    },
    '&:hover': {
      color: theme.palette.primary.contrastText
    }
  },
  root: {
    fontSize: '100%',
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  brand: {
    textDecoration: 'none'
  }
});

class ProcessDone extends Component {
  render() {
    const { classes, isLoadData } = this.props;
    return (
      <div className={classes.divCenter}>
        {isLoadData ? (
          <div>
            <Grid container justify="center" alignItems="center">
              <div>
                <CircularProgress size={100} thickness={1.5} />
              </div>
            </Grid>
            <div className={classes.divCenter}>
              <Typography variant="subtitle1" className={classes.subtitle}>
                Please wait while uploading your data to server...
              </Typography>
            </div>
          </div>
        ) : (
          <Grid container justify="center" alignItems="center">
            <IconButton
              color="primary"
              classes={{ root: classes.root, label: classes.iconButton }}
              fullWidth
            >
              <Ionicon icon="ios-cloud-done-outline" />
              <div>Done</div>
            </IconButton>
          </Grid>
        )}

        {/* <Grid container justify="center" alignItems="center">
          <NavLink to="/app/dashboard" className={classes.brand}>
            <IconButton
              color="primary"
              classes={{ root: classes.root, label: classes.iconButton }}
              onClick={this.handleUploadClick}
              fullWidth
            >
              <Ionicon icon="ios-cloud-done-outline" />
              <div>Done</div>
            </IconButton>
          </NavLink>
          </Grid> */}
      </div>
    );
  }
}

ProcessDone.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoadData: PropTypes.bool.isRequired
};

export default withStyles(styles)(ProcessDone);
