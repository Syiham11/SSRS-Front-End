import React, { Component } from 'react';
import {
  withStyles,
  Paper,
  Typography,
  Button,
  Avatar,
  Icon
} from '@material-ui/core';
import avatarApi from 'dan-api/images/avatars';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PropTypes from 'prop-types';
import styles from './Dashboard-jss';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';

const tasks = [
  { username: 'username 1', email: 'email1@gmail.com' },
  { username: 'username 2', email: 'email2@gmail.com' },
  { username: 'username 3', email: 'email3@gmail.com' },
  { username: 'username 4', email: 'email4@gmail.com' },
  { username: 'username 5', email: 'email5@gmail.com' },
  { username: 'username 6', email: 'email6@gmail.com' }
];

class NewUserList extends Component {
  render() {
    const { classes } = this.props;
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
            {tasks.map((task, index) => (
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
                      {task.username}
                    </Typography>
                    <Typography
                      id={'desc' + index}
                      variant="body2"
                      gutterBottom
                    >
                      {task.email}
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
