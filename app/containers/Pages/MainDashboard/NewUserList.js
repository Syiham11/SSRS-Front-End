import React, { Component } from 'react';
import {
  withStyles,
  Paper,
  Typography,
  Button,
  Avatar,
  Icon
} from '@material-ui/core';
import Axios from 'axios';
import avatarApi from 'dan-api/images/avatars';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PropTypes from 'prop-types';
import styles from './Dashboard-jss';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';

const apiURL = 'http://localhost:9090';

class NewUserList extends Component {
  state = {
    users: []
  };

  componentDidMount() {
    this.updateUsersList();
  }

  updateUsersList = () => {
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.get(apiURL + '/administration/getAllDeactivatedUsers', config).then(
      response => {
        this.setState({
          users: response.data
        });
      }
    );
  };

  activateUser = index => {
    const { users } = this.state;
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    users[index].activated = true;
    Axios.post(apiURL + '/updateUser', users[index], config).then(() => {
      this.updateUsersList();
    });
  };

  render() {
    const { classes } = this.props;
    const { users } = this.state;
    return (
      <div
        style={{
          height: '100%',
          width: '50%',
          margin: '10px 10px 10px 10px'
        }}
      >
        <PapperBlock
          title="New Users"
          whiteBg
          icon="ios-person-add"
          desc="New users account needs to be approuved"
        >
          <Paper className={classes.taskInnerDiv}>
            {users.map((user, index) => (
              <div
                className={classes.divSpace}
                style={{ padding: '10px 10px 10px 10px' }}
              >
                <div className={classes.divInline}>
                  <div>
                    <ListItemAvatar>
                      <Avatar alt="User Name" src={avatarApi[8]} />
                    </ListItemAvatar>
                  </div>
                  <div>
                    <Typography
                      id={'title' + index}
                      variant="body1"
                      gutterBottom
                    >
                      {user.username}
                    </Typography>
                    <Typography
                      id={'desc' + index}
                      variant="body2"
                      gutterBottom
                    >
                      {user.email}
                    </Typography>
                  </div>
                </div>
                <div>
                  <Button
                    variant="contained"
                    endIcon={<Icon>done</Icon>}
                    style={{
                      backgroundColor: '#5EBA7D',
                      fontSize: '12px',
                      color: 'white'
                    }}
                    onClick={() => this.activateUser(index)}
                  >
                    Approuve
                  </Button>
                </div>
              </div>
            ))}
          </Paper>
        </PapperBlock>
      </div>
    );
  }
}

NewUserList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewUserList);
