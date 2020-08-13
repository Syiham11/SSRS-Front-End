import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Avatar, withStyles, Grid, Paper, Typography
} from '@material-ui/core';
import avatarApi from 'dan-api/images/avatars';
import 'profile-picture/build/ProfilePicture.css';
import About from './About';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    boxShadow: theme.glow.light
  },
  divCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      '& button': {
        width: '100%',
        margin: 5
      }
    }
  },
  paperStyle: {
    background: theme.palette.primary.main,
    padding: theme.spacing(10),
    width: '100%',
    marginBottom: theme.spacing(3)
  },
  buttonLink: {
    background: 'none',
    padding: 0,
    margin: theme.spacing(2),
    textTransform: 'none',
    transition: 'color ease 0.3s',
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.primary.dark,
    fontSize: '0.875rem',
    '&:hover': {
      background: 'none',
      color: theme.palette.secondary.main
    }
  }
});

export class UserProfile extends Component {
  state = {
    imageURL: avatarApi[8]
  };

  componentDidMount() {
    const { user } = this.props;
    if (user.image !== '') {
      this.setState({
        imageURL: user.image
      });
    }
  }

  render() {
    const { imageURL } = this.state;
    const { classes, user } = this.props;
    return (
      <div className={classes.divCenter}>
        <Paper elevation={10} className={classes.paperStyle}>
          <div className={classes.divCenter}>
            <Avatar alt="User Name" src={imageURL} className={classes.large} />
            <Typography
              variant="h4"
              style={{
                color: '#FFF',
                fontFamily: 'sans-serif , Arial',
                marginTop: '20px'
              }}
            >
              {user.username}
            </Typography>
          </div>
        </Paper>
        <Grid
          container
          className={classes.root}
          spacing={2}
          style={{ height: '500px' }}
        >
          <Grid item xs={5}>
            <About user={user} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default withStyles(styles)(UserProfile);
