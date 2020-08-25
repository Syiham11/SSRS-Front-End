import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { IconButton, Tooltip } from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';
import AddIcon from '@material-ui/icons/Add';
import { PropTypes } from 'prop-types';
import MaterialTable from 'material-table';
import AlgorithmsServices from '../../Services/algorithm.js';
import Notification from '../../../components/Notification/Notification';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: theme.shade.light,
    color: theme.palette.text.primary
  }),
  settingDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: '1px solid #cccccc',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '5px 5px 15px rgba(0,0,0,0.1)'
  },
  timeBtn: {
    textTransform: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    marginRight: theme.spacing(7),
    transition: 'all ease 0.3s',
    boxShadow: '5px 5px 15px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      color: theme.palette.primary.main
    }
  },
  typography: {
    padding: theme.spacing(2)
  },
  timeItem: {
    borderLeft: '4px solid #fff',
    '&:hover': {
      borderLeft: '4px solid #00bcd4'
    }
  },
  timeItemIcon: {
    color: '#00bcd4',
    marginLeft: '10px'
  },
  dashboardDiv: {
    marginTop: theme.spacing(3)
  },
  gridLayout: {
    backgroundColor: '#fff',
    border: '1px solid #dad5d5',
    boxShadow: '2px 2px 5px 5px #cccccc'
  }
});
class AlgorithmHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      notifMessage: ''
    };
  }

  componentDidMount() {
    this.getAlgorithms();
  }

  getAlgorithms = () => {
    AlgorithmsServices.getAllAlgorithms().then(result => {
      const colAlgo = [];
      console.log(result.data);
      if (result.data.length > 0) {
        Object.keys(result.data[0]).forEach(c => {
          if (c !== 'algoId' && c !== 'user') {
            const cl = {
              title: c,
              field: c
            };
            colAlgo.push(cl);
          }
        });
      }
      this.setState({
        columns: colAlgo,
        data: result.data
      });
    });
  };

  handleDeleteAlgorithm = rowData => {
    AlgorithmsServices.deleteAlgorithm(rowData.algoId).then(res => {
      console.log(res);
      this.openNotif('Algorithm deleted');
      this.getAlgorithms();
    });
  };

  handleCreateAlgorithm = () => {
    const { changeCreateAlgo } = this.props;
    changeCreateAlgo(true);
  };

  handleRefresh = () => {
    this.getAlgorithms();
  };

  openNotif = message => {
    this.setState({
      notifMessage: message
    });
  };

  closeNotif = () => {
    this.setState({
      notifMessage: ''
    });
  };

  render() {
    const { classes } = this.props;
    const { data, columns, notifMessage } = this.state;
    return (
      <div>
        <Notification message={notifMessage} close={this.closeNotif} />

        <div className={classes.settingDiv}>
          <div>
            <Tooltip title="Add new algorithm">
              <IconButton
                size="small"
                className={classes.timeBtn}
                onClick={this.handleCreateAlgorithm}
                aria-label="upload picture"
                component="span"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                className={classes.timeBtn}
                onClick={this.handleRefresh}
                aria-label="upload picture"
                component="span"
              >
                <UpdateIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <MaterialTable
          title="Algorithms"
          columns={columns}
          data={data}
          options={{
            search: false,
            grouping: true,
            showSelectAllCheckbox: true,
            actionsColumnIndex: -1
          }}
          actions={[
            {
              icon: 'delete',
              tooltip: 'Delete algorithm',
              onClick: (event, rowData) => this.handleDeleteAlgorithm(rowData)
            }
          ]}
        />
      </div>
    );
  }
}
AlgorithmHome.propTypes = {
  classes: PropTypes.object.isRequired,
  changeCreateAlgo: PropTypes.func.isRequired
};
export default withStyles(styles)(AlgorithmHome);
