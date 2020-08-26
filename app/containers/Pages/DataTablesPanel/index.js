import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import Panel from './Panel';

export class controlPanel extends Component {
  render() {
    const title = brand.name + ' - Control Panel';
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
        <PapperBlock
          title="Control Panel"
          whiteBg
          icon="ios-person-outline"
          desc="Manage system users"
        >
          <Panel />
        </PapperBlock>
      </div>
    );
  }
}

export default controlPanel;
