import React, { Component } from 'react';
import {
  withStyles,
  Paper,
  Typography,
  Button,
  Avatar,
  Icon,
  DialogContent,
  Dialog
} from '@material-ui/core';
import avatarApi from 'dan-api/images/avatars';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PropTypes from 'prop-types';
import styles from './Dashboard-jss';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';
import UserProfile from '../UserProfile';
import UserServices from '../../Services/user';

class NewUserList extends Component {
  state = {
    users: [],
    userIndex: -1,
    isViewProfile: false
  };

  componentDidMount() {
    this.updateUsersList();
  }

  updateUsersList = () => {
    UserServices.getAllDeactivatedUsers().then(response => {
      this.setState({
        users: response.data
      });
    });
  };

  activateUser = index => {
    const { users } = this.state;
    users[index].activated = true;
    UserServices.update(users[index]).then(() => {
      this.updateUsersList();
    });
  };

  handleViewProfile = index => {
    this.setState({
      userIndex: index,
      isViewProfile: true
    });
  };

  handleCloseDialog = () => {
    this.setState({
      isViewProfile: false
    });
  };

  render() {
    const { classes } = this.props;
    const { users, userIndex, isViewProfile } = this.state;
    return (
      <div
        style={{
          height: '100%',
          width: '50%',
          margin: '10px 10px 10px 10px'
        }}
      >
        <Dialog
          maxWidth="xl"
          fullWidth
          aria-labelledby="changeProfilePic"
          open={isViewProfile}
          onClose={this.handleCloseDialog}
          classes={{
            paper: classes.paper
          }}
          PaperProps={{
            classes: {
              root: classes.paperColor
            }
          }}
        >
          <DialogContent>
            <UserProfile user={users[userIndex]} />
          </DialogContent>
        </Dialog>
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
                      onClick={() => this.handleViewProfile(index)}
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
