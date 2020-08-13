import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  IconButton, Slide, Snackbar,
  Tooltip
} from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { PropTypes } from 'prop-types';
import MaterialTable from 'material-table';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';
import AlgorithmsServices from '../../Services/algorithm.js';
import history from '../../../utils/history';

const styles = (theme) => ({
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
    padding: theme.spacing(2),
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
function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}
class AlgorithmHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      openStack: false,
    };
  }

  componentDidMount() {
    this.getAlgorithms();
  }

  getAlgorithms = () => {
    AlgorithmsServices.getAllAlgorithms().then(result => {
      const colAlgo = [];
      Object.keys(result.data[0]).forEach((c) => {
        if (c !== 'algoId') {
          const cl = {
            title: c,
            field: c,
          };
          colAlgo.push(cl);
        }
      });
      this.setState({
        columns: colAlgo,
        data: result.data
      });
    });
  };

  handleDeleteAlgorithm = (rowData) => {
    AlgorithmsServices.deleteAlgorithm(rowData.algoId).then(res => {
      console.log(res);
      this.getAlgorithms();
      this.setState({ openStack: true });
    });
  }

  handleCreateAlgorithm = () => {
    history.push('/app/algorithms');
  };

  handleCloseStack = () => {
    this.setState({ openStack: false });
  }

  handleRefresh = () => {
    this.getAlgorithms();
  };

  render() {
    const title = brand.name + ' - Algorithms';
    const description = brand.desc;
    const { classes } = this.props;
    const {
      data, columns, openStack,
    } = this.state;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
        </Helmet>
        <PapperBlock
          title="Algorithms"
          desc=""
          whiteBg
          noMargin
          icon="md-options"
        >
          <div className={classes.settingDiv}>
            <div>
              <Tooltip title="Add new algorithm">
                <IconButton size="small" className={classes.timeBtn} onClick={this.handleCreateAlgorithm} aria-label="upload picture" component="span">
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton size="small" className={classes.timeBtn} onClick={this.handleRefresh} aria-label="upload picture" component="span">
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
                onClick: (event, rowData) => this.handleDeleteAlgorithm(rowData),
              }
            ]}
          />
        </PapperBlock>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={openStack}
          autoHideDuration={3000}
          onClose={this.handleCloseStack}
          message="Algorithms deleted"
          TransitionComponent={TransitionLeft}
          action={
            (
              <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleCloseStack}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            )
          }
        />
      </div>
    );
  }
}
AlgorithmHome.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(AlgorithmHome);
