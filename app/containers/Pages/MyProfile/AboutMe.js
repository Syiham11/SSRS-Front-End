import React, { Component } from 'react';
import { PapperBlock } from 'dan-components';
import { PropTypes } from 'prop-types';
import Ionicon from 'react-ionicons';
import {
  Button,
  withStyles,
  TextField,
  Typography,
  Avatar
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import UserServices from '../../Services/user';

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
  state = {
    newPassword: '',
    isModifyProfile: false,
    username: '',
    email: '',
    idCardNumber: '',
    address: '',
    birthday: '',
    user: {}
  };

  componentDidMount() {
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    UserServices.getUserData(sessionUser.id).then(response => {
      const user = response.data;
      let userBirthday = '';
      if (user.birthday !== null) {
        userBirthday = this.formatDate(user.birthday).substring(0, 10);
      }
      this.setState({
        username: user.username,
        email: user.email,
        idCardNumber: user.idCardNumber,
        address: user.address,
        birthday: userBirthday,
        user
      });
    });
  }

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    });
  };

  handleEmailChange = e => {
    this.setState({
      email: e.target.value
    });
  };

  handleIdCardNumberChange = e => {
    this.setState({
      idCardNumber: e.target.value
    });
  };

  handleAddressChange = e => {
    this.setState({
      address: e.target.value
    });
  };

  handleBirthdayChange = value => {
    console.log(this.formatDate(value).substring(0, 10));
    this.setState({
      birthday: this.formatDate(value).substring(0, 10)
    });
  };

  formatDate = dateString => {
    const date = new Date(dateString);
    return date.toISOString(date);
  };

  handleModifyProfile = () => {
    this.setState({
      isModifyProfile: true
    });
  };

  handleModifyDone = () => {
    const {
      username,
      email,
      idCardNumber,
      address,
      birthday,
      user
    } = this.state;
    const { updateUser } = this.props;
    if (sessionStorage.getItem('user')) {
      const sessionUser = JSON.parse(sessionStorage.getItem('user'));
      user.username = username;
      user.email = email;
      user.idCardNumber = idCardNumber;
      user.address = address;
      user.birthday = birthday;
      UserServices.update(user).then(() => {
        sessionUser.username = username;
        sessionUser.sub = email;
        sessionStorage.setItem('user', JSON.stringify(sessionUser));
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(sessionUser));
        }
        this.setState({
          isModifyProfile: false,
          user
        });
        updateUser(user);
      });
    }
  };

  handleModifyCancel = () => {
    this.setState({
      isModifyProfile: false
    });
  };

  render() {
    const { classes } = this.props;
    const {
      newPassword,
      isModifyProfile,
      username,
      email,
      idCardNumber,
      address,
      birthday
    } = this.state;
    console.log('new date');
    console.log(new Date(birthday));
    return (
      <div>
        <PapperBlock
          title="About Me"
          whiteBg
          icon="md-person"
          desc="My personal Informations"
        >
          {isModifyProfile ? (
            <div className={classes.divCenter}>
              <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                value={username}
                className={classes.textField}
                onChange={this.handleUsernameChange}
                style={{ marginBottom: 10, width: '50%', margin: 15 }}
              />
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={email}
                className={classes.textField}
                onChange={this.handleEmailChange}
                style={{ marginBottom: 10, width: '50%', margin: 15 }}
              />
              <TextField
                id="outlined-basic"
                label="ID Card Number"
                variant="outlined"
                value={idCardNumber}
                className={classes.textField}
                onChange={this.handleIdCardNumberChange}
                style={{ marginBottom: 10, width: '50%', margin: 15 }}
              />
              <TextField
                id="outlined-basic"
                label="Address"
                variant="outlined"
                value={address}
                className={classes.textField}
                onChange={this.handleAddressChange}
                style={{ marginBottom: 10, width: '50%', margin: 15 }}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Choose date"
                  value={new Date(birthday)}
                  onChange={this.handleBirthdayChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                  style={{ marginBottom: 10, width: '50%', margin: 15 }}
                />
              </MuiPickersUtilsProvider>
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                value={newPassword}
                className={classes.textField}
                onChange={this.handleTitleChange}
                style={{ marginBottom: 10, width: '50%', margin: 15 }}
              />
              <div>
                <Button
                  size="small"
                  className={classes.buttonLink}
                  onClick={this.handleModifyDone}
                >
                  Done
                </Button>
                <Button
                  size="small"
                  className={classes.buttonLink}
                  onClick={this.handleModifyCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
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
                    {email}
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
                    {idCardNumber}
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
                    {address}
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
                    {birthday}
                  </Typography>
                </div>
              </div>
              <div className={classes.divCenter}>
                <div>
                  <Button
                    size="small"
                    className={classes.buttonLink}
                    onClick={this.handleModifyProfile}
                  >
                    Modify profile
                  </Button>
                  <Button
                    size="small"
                    className={classes.buttonLink}
                    onClick={this.handleOpenDialog}
                  >
                    Change password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </PapperBlock>
      </div>
    );
  }
}

AboutMe.propTypes = {
  classes: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired
};

export default withStyles(styles)(AboutMe);
