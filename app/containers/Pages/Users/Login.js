import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import handleLogin from 'dan-actions/LoginFormActions';
import { withStyles } from '@material-ui/core/styles';
import { LoginForm } from 'dan-components';
import styles from 'dan-components/Forms/user-jss';

class Login extends React.Component {
  submitForm(values) {
    const { login } = this.props;
    const user = {
      email: values.toJS().email,
      password: values.toJS().password
    };
    login(user, values.toJS().checkbox);
  }

  render() {
    const title = brand.name + ' - Login';
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
            <LoginForm onSubmit={values => this.submitForm(values)} />
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(handleLogin, dispatch)
});

const LoginMapped = connect(
  null,
  mapDispatchToProps
)(Login);

export default withStyles(styles)(LoginMapped);
