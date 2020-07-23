import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
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
    const { handleSetChartType } = this.props;
    handleSetChartType(title);
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
  handleSetChartType: PropTypes.func.isRequired
};

export default withStyles(styles)(ChartTypesList);
