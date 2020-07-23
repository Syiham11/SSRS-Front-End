import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapse } from '@material-ui/core';
import { setCharts } from 'dan-actions/workspaceActions';
import brand from 'dan-api/dummy/brand';
import WorkspaceList from './WorkspaceList';
import VisualizationBlocks from './VisualizationBlocks';
import ReportEditor from './ReportEditor';

class WorkspaceComponent extends Component {
  state = {
    type: 'workspaces'
  };

  componentWillUnmount() {
    const { setWorkspaceCharts } = this.props;
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
          data: []
        }
      }
    ];
    setWorkspaceCharts(charts);
  }

  handleSetType = type => {
    this.setState({
      type
    });
  };

  render() {
    const { type } = this.state;
    const title = brand.name + ' - Workspace';
    const description = brand.desc;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <Collapse in={type === 'workspaces'}>
          <WorkspaceList handleSetType={this.handleSetType} />
        </Collapse>
        {type === 'visualize' || type === 'report' ? (
          <div>
            <Collapse in={type === 'visualize'}>
              <VisualizationBlocks handleSetType={this.handleSetType} />
            </Collapse>
            <Collapse in={type === 'report'}>
              <ReportEditor handleSetType={this.handleSetType} />
            </Collapse>
            {' '}
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

WorkspaceComponent.propTypes = {
  setWorkspaceCharts: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  setWorkspaceCharts: bindActionCreators(setCharts, dispatch)
});

const WorkspaceComponentMapped = connect(
  null,
  mapDispatchToProps
)(WorkspaceComponent);

export default WorkspaceComponentMapped;
