import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCharts as setWSChart } from 'dan-actions/workspaceActions';
import { setCharts as setDBChart } from 'dan-actions/dashboardActions';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import chartsInfos from './ChartsInfos';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)'
  },
  title: {
    color: theme.palette.primary.light
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  tile: {
    '&:hover': {
      opacity: 0.7
    }
  }
});

class ChartTypesList extends Component {
  handleClick = title => {
    const {
      charts,
      setWorkspaceCharts,
      setDashboardCharts,
      id,
      parent
    } = this.props;
    const chartList = JSON.parse(JSON.stringify(charts));
    chartList[id].settings.choosedChart = title;
    if (parent === 'workspace') {
      setWorkspaceCharts(chartList);
    } else setDashboardCharts(chartList);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={2}>
          {chartsInfos.map(tile => (
            <GridListTile
              key={tile.title}
              onClick={() => this.handleClick(tile.title)}
              style={{ cursor: 'pointer' }}
              className={classes.tile}
            >
              <img src={tile.img} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                classes={{
                  root: classes.titleBar,
                  title: classes.title
                }}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

ChartTypesList.propTypes = {
  classes: PropTypes.object.isRequired,
  charts: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  setWorkspaceCharts: PropTypes.func.isRequired,
  setDashboardCharts: PropTypes.func.isRequired,
  parent: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  charts: state.get(ownProps.parent).toJS().charts
});

const mapDispatchToProps = dispatch => ({
  setWorkspaceCharts: bindActionCreators(setWSChart, dispatch),
  setDashboardCharts: bindActionCreators(setDBChart, dispatch)
});

const ChartTypesListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartTypesList);

export default withStyles(styles)(ChartTypesListMapped);
