import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapse, Slide } from '@material-ui/core';
import { setCharts } from 'dan-actions/workspaceActions';
import brand from 'dan-api/dummy/brand';
import WorkspaceList from './WorkspaceList';
import VisualizationBlocks from './VisualizationBlocks';
import ReportEditor from './ReportEditor';

class WorkspaceComponent extends Component {
  state = {
    type: 'workspaces',
    own: true
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

  handleSetOwn = own => {
    this.setState({
      own
    });
  };

  render() {
    const { type, own } = this.state;
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
        <Slide
          direction="right"
          in={type === 'workspaces'}
          style={{ transitionDelay: type === 'workspaces' ? '500ms' : '0ms' }}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <WorkspaceList
              handleSetType={this.handleSetType}
              handleSetOwn={this.handleSetOwn}
            />
          </div>
        </Slide>
        {type === 'visualize' || type === 'report' ? (
          <div>
            <Collapse in={type === 'visualize'}>
              <VisualizationBlocks
                handleSetType={this.handleSetType}
                own={own}
              />
            </Collapse>
            <Collapse in={type === 'report'}>
              <ReportEditor handleSetType={this.handleSetType} type={type} />
            </Collapse>
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
