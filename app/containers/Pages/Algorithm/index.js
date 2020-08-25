import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { Slide } from '@material-ui/core';
import CreateAlgorithm from './CreateAlgorithm';
import AlgorithmHome from './home';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';

export class Algorithms extends Component {
  state = {
    isCreateAlgo: false
  };

  handleChangeCreateAlgo = bool => {
    this.setState({
      isCreateAlgo: bool
    });
  };

  render() {
    const { isCreateAlgo } = this.state;
    const title = brand.name + ' - Algorithms';
    const description = brand.desc;
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
          icon="ios-hammer-outline"
        >
          <Slide
            direction="right"
            in={isCreateAlgo}
            style={{ transitionDelay: isCreateAlgo ? '500ms' : '0ms' }}
            mountOnEnter
            unmountOnExit
          >
            <CreateAlgorithm />
          </Slide>
          <Slide
            direction="right"
            in={!isCreateAlgo}
            style={{ transitionDelay: !isCreateAlgo ? '500ms' : '0ms' }}
            mountOnEnter
            unmountOnExit
          >
            <AlgorithmHome changeCreateAlgo={this.handleChangeCreateAlgo} />
          </Slide>
        </PapperBlock>
      </div>
    );
  }
}

export default Algorithms;
