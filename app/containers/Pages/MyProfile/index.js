import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Avatar,
  Badge,
  Button,
  withStyles,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Paper,
  Typography,
  Tooltip
} from '@material-ui/core';
import avatarApi from 'dan-api/images/avatars';
import ProfilePicture from 'profile-picture';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import 'profile-picture/build/ProfilePicture.css';
import parallaxPetal from 'dan-images/decoration/parallaxPetal11.png';
import AboutMe from './AboutMe';
import UserServices from '../../Services/user';

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
  },
  decorationParallelPetal: {
    width: '100%',
    height: '300px',
    position: 'absolute',
    transform: 'scale(-1,-1)',
    left: 0,
    top: 285,
    opacity: 0.1
  },
  badgeButton: {
    backgroundColor: theme.palette.background.paper
  }
});

const SmallAvatar = withStyles(theme => ({
  root: {
    width: 40,
    height: 40,
    border: `2px solid ${theme.palette.background.paper}`
  }
}))(Avatar);

export class MyProfile extends Component {
  state = {
    user: {},
    isChangeProfilePic: false
  };

  profilePictureRef = React.createRef();

  componentDidMount() {
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    UserServices.getUserData(sessionUser.id).then(response => {
      const user = response.data;
      if (user.image === '') {
        const avatarImage = avatarApi[8];
        user.image = avatarImage;
      }
      this.setState({
        user
      });
    });
  }

  handleUpload = () => {
    // const PP = this.profilePicture.current;
    /* const imageData = PP.getData();
        const file = imageData.file; */
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    const { user } = this.state;
    const PP = this.profilePictureRef.current;
    const imageAsDataURL = PP.getImageAsDataUrl();
    if (sessionStorage.getItem('user')) {
      user.image = imageAsDataURL;
      console.log(user);
      UserServices.update(user).then(() => {
        this.setState({
          user
        });
        console.log(imageAsDataURL);
        sessionUser.image = imageAsDataURL;
        sessionStorage.setItem('user', JSON.stringify(sessionUser));
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(sessionUser));
        }
        console.log('photo updated');
      });
    }
    this.handleDialogClose();
    // add here the upload logic...
  };

  handleDialogClose = () => {
    this.setState({
      isChangeProfilePic: false
    });
  };

  handleOpenDialog = () => {
    this.setState({
      isChangeProfilePic: true
    });
  };

  updateUser = user => {
    this.setState({
      user
    });
  };

  render() {
    const { classes } = this.props;
    const { user, isChangeProfilePic } = this.state;
    console.log(user);
    console.log('up is index');
    return (
      <div className={classes.divCenter}>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          fullWidth
          aria-labelledby="changeProfilePic"
          open={isChangeProfilePic}
          classes={{
            paper: classes.paper
          }}
        >
          <DialogTitle id="SaveFormula">Change profile picture</DialogTitle>
          <DialogContent>
            <ProfilePicture
              ref={this.profilePictureRef}
              frameSize={1}
              frameFormat="circle"
              useHelper
              debug
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleUpload} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
        <Paper elevation={10} className={classes.paperStyle}>
          <img
            src={parallaxPetal}
            alt="decoration"
            className={classes.decorationParallelPetal}
          />
          <div className={classes.divCenter}>
            <Badge
              overlap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              badgeContent={(
                <Tooltip title="Change profile picture">
                  <SmallAvatar>
                    <Button
                      variant="contained"
                      onClick={this.handleOpenDialog}
                      className={classes.badgeButton}
                    >
                      <EditRoundedIcon color="secondary" />
                    </Button>
                  </SmallAvatar>
                </Tooltip>
              )}
            >
              <Avatar
                alt="User Name"
                src={user.image}
                className={classes.large}
              />
            </Badge>
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
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={5}>
            <AboutMe user={user} updateUser={this.updateUser} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

MyProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MyProfile);
