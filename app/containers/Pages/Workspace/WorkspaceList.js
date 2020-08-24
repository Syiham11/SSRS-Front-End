import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTitle, setCharts } from 'dan-actions/workspaceActions';
import PropTypes from 'prop-types';
import { PapperBlock } from 'dan-components';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Checkbox,
  Tooltip
} from '@material-ui/core';
import WorkspaceServices from '../../Services/workspace';
import SharewithServices from '../../Services/sharewith';

class WorkspaceList extends Component {
  state = {
    workspaces: [],
    workspaceShared: [],
    open: false,
    users: [],
    usersChecked: false,
    workspaceId: -1,
    deleteFrom: false
  };

  componentDidMount() {
    this.updateWorkspacesList();
  }

  updateWorkspacesList = () => {
    WorkspaceServices.getAll().then(response => {
      this.setState({
        workspaces: response.data
      });
    });
    SharewithServices.getWorkspaceShared().then(result => {
      this.setState({ workspaceShared: result.data });
    });
  };

  handleOpenWorkspace = (workspaceId, index, type) => {
    const {
      setWorkspaceCharts, setWorkspaceTitle, handleSetType,
      handleSetOwn
    } = this.props;
    const { workspaces, workspaceShared } = this.state;
    WorkspaceServices.getCharts(workspaceId)
      .then(response => {
        const list = [];
        const array = response.data;
        let id = 0;
        array.forEach(element => {
          const obj = {
            id,
            settings: JSON.parse(element.settings)
          };
          list.push(obj);
          id += 1;
        });
        setWorkspaceCharts(list);
        if (type === 'own') {
          setWorkspaceTitle(workspaces[index].title);
          handleSetOwn(true);
        } else {
          setWorkspaceTitle(workspaceShared[index].title);
          handleSetOwn(false);
        }
        handleSetType('visualize');
      });
  };

  handleCheck = (event, userId) => {
    const { users } = this.state;
    const newUsers = users;
    newUsers.forEach(user => {
      if (user.userId === userId) {
        user.checked = event.target.checked;
      }
    });
    this.setState({ users: newUsers, usersChecked: false });
  };

  handleSave = () => {
    const { users, workspaceId } = this.state;
    const shareUsers = [];
    users.forEach(user => {
      user.checked ? shareUsers.push(user.email) : null;
    });
    if (shareUsers.length === 0) {
      this.setState({ usersChecked: true });
    } else {
      const shareWith = {
        emails: shareUsers.join('-')
      };
      SharewithServices.shareWorkspace(workspaceId, shareWith).then(() => {
        this.setState({ open: false });
      });
    }
  };

  handleOpenUsersDialog = (workspaceId, index) => {
    console.log(index);
    this.setState({ workspaceId });
    SharewithServices.getUsers(workspaceId).then(usersdata => {
      usersdata.data.forEach(user => { user.checked = false; });
      this.setState({ open: true, users: usersdata.data });
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDeleteWorkspace = workspace => {
    WorkspaceServices.delete(workspace).then(() => {
      this.updateWorkspacesList();
    });
  };

  handleNewWorkspace = () => {
    const { setWorkspaceCharts, setWorkspaceTitle, handleSetType } = this.props;

    const charts = [
      {
        id: 0,
        settings: {
          choosedChart: '',
          axisList: [],
          chartParam: {
            axisX: '',
            title: '',
            xtitle: '',
            ytitle: '',
            showBrush: false,
            table: '',
            choosedColumns: ''
          },
          data: [{}]
        }
      }
    ];
    setWorkspaceCharts(charts);
    setWorkspaceTitle('Workspace');
    handleSetType('visualize');
  };

  handleDeleteUsers = () => {
    const { workspaceId } = this.state;
    SharewithServices.getWorkspaceUsers(workspaceId).then(usersdata => {
      this.setState({ deleteFrom: true, users: usersdata.data });
    });
  };

  handleGetUserToShare = () => {
    const { workspaceId } = this.state;
    SharewithServices.getUsers(workspaceId).then(usersdata => {
      usersdata.data.forEach(user => { user.checked = false; });
      this.setState({ deleteFrom: false, users: usersdata.data });
    });
  };

  handleDeleteWorkspaceUsers = (email) => {
    const { workspaceId } = this.state;
    SharewithServices.deleteUserFromSharing(workspaceId, email).then(result => {
      console.log(result);
      this.handleDeleteUsers();
    });
  };

  render() {
    const {
      workspaces, open, users,
      usersChecked, workspaceShared,
      deleteFrom
    } = this.state;
    console.log(deleteFrom);
    return (
      <div>
        <PapperBlock
          title="Workspaces"
          whiteBg
          icon="ios-desktop-outline"
          desc="Choose a workspace or click on plus button to create a new workspace"
        >
          <Typography variant="h6" color="primary" style={{ marginBottom: 25 }}>
            My workspaces
          </Typography>
          <Table aria-label="workspaces">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="left">Creation time</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {workspaces.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="left">{row.creationTime}</TableCell>
                  <TableCell align="right" scope="row">
                    <Button
                      value={index}
                      onClick={() => this.handleOpenWorkspace(row.workspaceId, index, 'own')
                      }
                    >
                      Open
                    </Button>
                    <Button
                      value={index}
                      onClick={() => this.handleOpenUsersDialog(row.workspaceId, index)
                      }
                    >
                      Share
                    </Button>
                    <Button
                      value={index}
                      onClick={() => this.handleDeleteWorkspace(row)}
                      color="primary"
                    >
                      delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Tooltip title="Create new workspace">
            <IconButton
              aria-label="Add"
              onClick={this.handleNewWorkspace}
              size="medium"
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            color="primary"
            style={{ marginTop: 60, marginBottom: 25 }}
          >
            Workspaces shared with me
          </Typography>
          <Table aria-label="Formulas">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="left">Owner</TableCell>
                <TableCell align="left">Creation time</TableCell>
                <TableCell align="center">Last Update</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {workspaceShared.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="left">{row.user.username}</TableCell>
                  <TableCell align="left">{row.creationTime}</TableCell>
                  <TableCell align="center">{row.lastUpdate}</TableCell>
                  <TableCell align="right" scope="row">
                    <Button
                      value={index}
                      onClick={() => this.handleOpenWorkspace(row.workspaceId, index)
                      }
                    >
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PapperBlock>
        <Dialog
          open={open}
          disableBackdropClick
          disableEscapeKeyDown
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="alert-dialog-title">Share workspace</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="caption" gutterBottom align="center">
                Choose users
              </Typography>
              {
                usersChecked ? (
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    align="center"
                    color="primary"
                  >
                    choose at least one user
                  </Typography>
                ) : (<div />)
              }
              {
                deleteFrom ? (
                  <Button onClick={this.handleGetUserToShare}>Share with Users</Button>
                ) : (
                  <Button onClick={this.handleDeleteUsers}>Remove Users from sharing</Button>
                )
              }
              <Table aria-label="Formulas">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((row) => (
                    <TableRow key={row.username}>
                      {
                        !deleteFrom ? (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={row.checked}
                              onChange={(event) => this.handleCheck(event, row.userId)}
                            />
                          </TableCell>
                        ) : (<div />)
                      }
                      <TableCell align="left">{row.username}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      {
                        deleteFrom ? (
                          <TableCell align="right" scope="row">
                            <Button
                              onClick={() => this.handleDeleteWorkspaceUsers(row.email)}
                              color="primary"
                            >
                              delete
                            </Button>
                          </TableCell>
                        ) : (<div />)
                      }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            {
              deleteFrom ? (
                <div />
              ) : (
                <Button
                  color="primary"
                  disabled={users.length === 0}
                  onClick={this.handleSave}
                >
                  share
                </Button>
              )
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

WorkspaceList.propTypes = {
  setWorkspaceTitle: PropTypes.func.isRequired,
  setWorkspaceCharts: PropTypes.func.isRequired,
  handleSetType: PropTypes.func.isRequired,
  handleSetOwn: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  setWorkspaceTitle: bindActionCreators(setTitle, dispatch),
  setWorkspaceCharts: bindActionCreators(setCharts, dispatch)
});

const WorkspaceListMapped = connect(
  null,
  mapDispatchToProps
)(WorkspaceList);

export default WorkspaceListMapped;
