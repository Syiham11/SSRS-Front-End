import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { handleRegister, registerInit } from 'dan-actions/RegisterFormActions';
import { withStyles } from '@material-ui/core/styles';
import brand from 'dan-api/dummy/brand';
import { RegisterForm } from 'dan-components';
import styles from 'dan-components/Forms/user-jss';

class Register extends React.Component {
  componentWillUnmount() {
    const { init } = this.props;
    init();
  }

  submitForm = values => {
    const { register } = this.props;
    const user = {
      username: values.toJS().username,
      email: values.toJS().email,
      password: values.toJS().password,
      creationTime: new Date()
    };
    register(user);
  };

  render() {
    const title = brand.name + ' - Register';
    const description = brand.desc;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <div className={classes.container}>
          <div className={classes.userFormWrap}>
            <RegisterForm onSubmit={values => this.submitForm(values)} />
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  init: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  register: bindActionCreators(handleRegister, dispatch),
  init: bindActionCreators(registerInit, dispatch)
});

const RegisterMapped = connect(
  null,
  mapDispatchToProps
)(Register);

export default withStyles(styles)(RegisterMapped);
