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
  Divider,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions, Dialog,
  Checkbox
} from '@material-ui/core';
import WorkspaceServices from '../../Services/workspace';


class WorkspaceList extends Component {
  state = {
    workspaces: [],
    open: false
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
  };

  handleOpenWorkspace = (workspaceId, index) => {
    const { setWorkspaceCharts, setWorkspaceTitle, handleSetType } = this.props;
    const { workspaces } = this.state;
    WorkspaceServices.getCharts(workspaceId).then(response => {
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
      setWorkspaceTitle(workspaces[index].title);
      handleSetType('visualize');
    });
  };

  handleOpenUsersDialog = (workspaceId, index) => {
    console.log(workspaceId, 'tout => ', index);
    this.setState({ open: true });
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

  render() {
    const { workspaces, open } = this.state;
    return (
      <div>
        <PapperBlock
          title="Workspaces"
          whiteBg
          icon="ios-desktop-outline"
          desc="Choose a workspace ot click on new to create a new workspace"
        >
          <Table aria-label="Formulas">
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
                      onClick={() => this.handleOpenWorkspace(row.workspaceId, index)
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
          <IconButton
            aria-label="Add"
            onClick={this.handleNewWorkspace}
            size="medium"
          >
            <AddCircleOutlineIcon />
          </IconButton>
          <Divider variant="fullWidth" />
          <div style={{ textAlign: 'center', alignItems: 'center', alignContent: 'center' }}>
            <Typography variant="h6" color="primary" style={{ marginTop: '10px' }}>Workspaces shared with you</Typography>
          </div>
          <Table aria-label="Formulas">
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
              <Typography
                variant="caption"
                gutterBottom
                align="center"
              >
                Choose users
              </Typography>
              <Table aria-label="Formulas">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Email</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workspaces.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked
                        />
                      </TableCell>
                      <TableCell align="left">{row.creationTime}</TableCell>
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
            <Button
              color="primary"
              onClick={this.handleSave}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

WorkspaceList.propTypes = {
  setWorkspaceTitle: PropTypes.func.isRequired,
  setWorkspaceCharts: PropTypes.func.isRequired,
  handleSetType: PropTypes.func.isRequired
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
