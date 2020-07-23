import React, { Component } from 'react';
import Axios from 'axios';
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
  IconButton
} from '@material-ui/core';

const apiURL = 'http://localhost:9090/workspace';

class WorkspaceList extends Component {
  state = {
    workspaces: []
  };

  componentDidMount() {
    this.updateWorkspacesList();
  }

  updateWorkspacesList = () => {
    const { sub } = JSON.parse(sessionStorage.getItem('user'));
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.get(apiURL + '/getAll&' + sub, config).then(response => {
      this.setState({
        workspaces: response.data
      });
    });
  };

  handleOpenWorkspace = (workspaceId, index) => {
    const { setWorkspaceCharts, setWorkspaceTitle, handleSetType } = this.props;
    const { workspaces } = this.state;
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.get(apiURL + '/' + workspaceId + '/charts', config).then(response => {
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

  handleDeleteWorkspace = workspace => {
    const config = {
      headers: { Authorization: sessionStorage.getItem('token') }
    };
    Axios.post(apiURL + '/delete', workspace, config).then(() => {
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
    const { workspaces } = this.state;
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
                      onClick={() => this.handleDeleteWorkspace(row)}
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
        </PapperBlock>
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
