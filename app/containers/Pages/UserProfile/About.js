import React, { Component } from 'react';
import { PapperBlock } from 'dan-components';
import { PropTypes } from 'prop-types';
import Ionicon from 'react-ionicons';
import { withStyles, Typography, Avatar } from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1
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
  },
  divInline: {
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20
  }
});

export class AboutMe extends Component {
  formatDate = dateString => {
    const date = new Date(dateString);
    let toString = date.toISOString(date);
    toString = toString.substring(0, 10);
    return toString;
  };

  render() {
    const { classes, user } = this.props;
    let userBirthday = '';
    if (user.birthday !== null) {
      userBirthday = user.birthday.substring(0, 10);
    }
    return (
      <PapperBlock
        title="About"
        whiteBg
        icon="ios-person-outline"
        desc="Personal Informations"
      >
        <div className={classes.divInline}>
          <Avatar>
            <Ionicon icon="md-mail" />
          </Avatar>
          <div style={{ marginLeft: 20 }}>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                marginBottom: -5
              }}
            >
              Mail
            </Typography>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                opacity: 0.7
              }}
            >
              {user.email}
            </Typography>
          </div>
        </div>
        <div className={classes.divInline}>
          <Avatar>
            <Ionicon icon="md-card" />
          </Avatar>
          <div style={{ marginLeft: 20 }}>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                marginBottom: -5
              }}
            >
              ID Card
            </Typography>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                opacity: 0.7
              }}
            >
              {user.idCardNumber}
            </Typography>
          </div>
        </div>
        <div className={classes.divInline}>
          <Avatar>
            <Ionicon icon="md-locate" />
          </Avatar>
          <div style={{ marginLeft: 20 }}>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                marginBottom: -5
              }}
            >
              Address
            </Typography>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                opacity: 0.7
              }}
            >
              {user.address}
            </Typography>
          </div>
        </div>
        <div className={classes.divInline}>
          <Avatar>
            <Ionicon icon="md-calendar" />
          </Avatar>
          <div style={{ marginLeft: 20 }}>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                marginBottom: -5
              }}
            >
              Birthday
            </Typography>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                opacity: 0.7
              }}
            >
              {userBirthday}
            </Typography>
          </div>
        </div>

        <div className={classes.divInline}>
          <Avatar>
            <Ionicon icon="md-add" />
          </Avatar>
          <div style={{ marginLeft: 20 }}>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                marginBottom: -5
              }}
            >
              Joined on:
            </Typography>
            <Typography
              variant="subtitle1"
              style={{
                color: '#000',
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px',
                opacity: 0.7
              }}
            >
              {this.formatDate(user.creationTime)}
            </Typography>
          </div>
        </div>
      </PapperBlock>
    );
  }
}

AboutMe.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default withStyles(styles)(AboutMe);
