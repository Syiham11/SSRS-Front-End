import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import ImportComponent from './ImportComponent';

const styles = () => ({
  root: {
    flexGrow: 1,
    marginBottom: '10px'
  }
});

class Import extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue
    });
  };

  render() {
    const { value } = this.state;
    const { classes } = this.props;
    const title = brand.name + ' - Import Page';
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
        <Paper className={classes.root}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
          </Tabs>
        </Paper>
        <ImportComponent id="1" hidden={value !== 0} />
        <ImportComponent id="2" hidden={value !== 1} />
        <ImportComponent id="3" hidden={value !== 2} />
      </div>
    );
  }
}

Import.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Import);
