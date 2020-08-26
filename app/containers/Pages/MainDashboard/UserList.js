import React, { Component } from 'react';
import {
  withStyles,
  Paper,
  Typography,
  Avatar,
  DialogContent,
  Dialog,
  Tooltip,
  IconButton
  // TextField,
  // InputAdornment
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import avatarApi from 'dan-api/images/avatars';
// import SearchIcon from '@material-ui/icons/Search';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './Dashboard-jss';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';
import UserProfile from '../UserProfile';
import UserServices from '../../Services/user';

class UserList extends Component {
  state = {
    users: [],
    userIndex: -1,
    isViewProfile: false,
    lastPage: 0,
    hasNext: true
  };

  componentDidMount() {}

  fetchMoreData = () => {
    const { lastPage, users, hasNext } = this.state;
    if (hasNext) {
      UserServices.getUsersByRange(lastPage, 10).then(response => {
        console.log(response.data.length);
        const { sub } = JSON.parse(sessionStorage.getItem('user'));
        const usersList = response.data.filter(item => item.email !== sub);
        if (usersList.length === 0) {
          console.log('empty');
          this.setState({
            hasNext: false
          });
        } else {
          this.setState({
            users: users.concat(usersList),
            lastPage: lastPage + 1
          });
        }
      });
    }
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
    const {
      users, userIndex, isViewProfile, hasNext
    } = this.state;
    return (
      <div
        style={{
          height: '50%',
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
          title="System users"
          whiteBg
          icon="ios-person"
          desc="New users account needs to be approuved"
        >
          {/* <TextField
            id="input-with-icon-textfield"
            type="search"
            value="filter"
            onChange={this.handleChangeSearch}
            className={classes.searchBox}
            InputProps={{
              placeholder: 'Search',
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          /> */}
          <Paper
            className={classes.taskInnerDiv}
            ref={ref => {
              this.scrollParentRef = ref;
            }}
          >
            <InfiniteScroll
              pageStart={0}
              loadMore={this.fetchMoreData}
              hasMore={hasNext}
              loader={(
                <div className={classes.divCenter}>
                  <img
                    src="/images/spinner.gif"
                    alt="spinner"
                    style={{ width: '40px', height: '40px' }}
                  />
                </div>
              )}
              useWindow={false}
              getScrollParent={() => this.scrollParentRef}
            >
              {users.map((user, index) => (
                <div
                  className={classes.divSpace}
                  style={{ padding: '10px 10px 10px 10px' }}
                >
                  <div className={classes.divInline}>
                    <div>
                      <ListItemAvatar>
                        <Avatar
                          alt="User Name"
                          src={user.image === '' ? avatarApi[8] : user.image}
                        />
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
                    <Tooltip title="View profile">
                      <IconButton
                        aria-label="viewProfile"
                        className={classes.margin}
                        onClick={() => this.handleViewProfile(index)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </Paper>
        </PapperBlock>
      </div>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserList);
