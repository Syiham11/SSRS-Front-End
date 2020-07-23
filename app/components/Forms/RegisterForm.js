import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form/immutable';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ArrowForward from '@material-ui/icons/ArrowForward';
import AllInclusive from '@material-ui/icons/AllInclusive';
import Brightness5 from '@material-ui/icons/Brightness5';
import People from '@material-ui/icons/People';
import Icon from '@material-ui/core/Icon';
import Hidden from '@material-ui/core/Hidden';
import brand from 'dan-api/dummy/brand';
import logo from 'dan-images/logo.png';
import { TextFieldRedux, CheckboxRedux } from './ReduxFormMUI';
import styles from './user-jss';

// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

const passwordsMatch = (value, allValues) => {
  if (value !== allValues.get('password')) {
    return 'Passwords dont match';
  }
  return undefined;
};

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
});

// eslint-disable-next-line
class RegisterForm extends React.Component {
  state = {
    tab: 0,
  };

  handleClickShowPassword = () => {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };


  render() {
    const {
      classes,
      handleSubmit,
      pristine,
      submitting,
      deco,
      isSucceeded,
      errorMessage
    } = this.props;
    const { tab } = this.state;
    return (
      <Fragment>
        <Hidden mdUp>
          <NavLink to="/" className={classNames(classes.brand, classes.outer)}>
            <img src={logo} alt={brand.name} />
            {brand.name}
          </NavLink>
        </Hidden>
        <Paper className={classNames(classes.paperWrap, deco && classes.petal)}>
          <Hidden smDown>
            <div className={classes.topBar}>
              <NavLink to="/" className={classes.brand}>
                <img src={logo} alt={brand.name} />
                {brand.name}
              </NavLink>
              <Button size="small" className={classes.buttonLink} component={LinkBtn} to="/login">
                <Icon className={classes.icon}>arrow_forward</Icon>
                Already have account ?
              </Button>
            </div>
          </Hidden>
          <Typography variant="h4" className={classes.title} gutterBottom>
            Register
          </Typography>
          {tab === 0 && (
            <section className={classes.formWrap}>
              {!isSucceeded ? <div style={{ color: 'red', fontSize: 14 }}>{errorMessage}</div> : <Redirect to="/login" />}
              <form onSubmit={handleSubmit}>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="username"
                      component={TextFieldRedux}
                      placeholder="Username"
                      label="Username"
                      required
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="email"
                      component={TextFieldRedux}
                      placeholder="Your Email"
                      label="Your Email"
                      required
                      validate={[required, email]}
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="password"
                      component={TextFieldRedux}
                      type="password"
                      label="Your Password"
                      required
                      validate={[required, passwordsMatch]}
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="passwordConfirm"
                      component={TextFieldRedux}
                      type="password"
                      label="Re-type Password"
                      required
                      validate={[required, passwordsMatch]}
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControlLabel
                    control={(
                      <Field name="checkbox" component={CheckboxRedux} required className={classes.agree} />
                    )}
                    label="Agree with"
                  />
                  <a href="#" className={classes.link}>Terms &amp; Condition</a>
                </div>
                <div className={classes.btnArea}>
                  <Button variant="contained" color="primary" type="submit">
                    Sign Up
                    <ArrowForward className={classNames(classes.rightIcon, classes.iconSmall)} disabled={submitting || pristine} />
                  </Button>
                </div>
              </form>
            </section>
          )}
          {tab === 1 && (
            <section className={classes.socmedFull}>
              <Button fullWidth variant="outlined" size="large" className={classes.redBtn} type="button">
                <AllInclusive className={classNames(classes.leftIcon, classes.iconSmall)} />
                Socmed 1
              </Button>
              <Button fullWidth variant="outlined" size="large" className={classes.blueBtn} type="button">
                <Brightness5 className={classNames(classes.leftIcon, classes.iconSmall)} />
                Socmed 2
              </Button>
              <Button fullWidth variant="outlined" size="large" className={classes.cyanBtn} type="button">
                <People className={classNames(classes.leftIcon, classes.iconSmall)} />
                Socmed 3
              </Button>
            </section>
          )}
        </Paper>
      </Fragment>
    );
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  deco: PropTypes.bool.isRequired,
  isSucceeded: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  deco: state.getIn(['ui', 'decoration']),
  isSucceeded: state.getIn(['register', 'isSucceeded']),
  errorMessage: state.getIn(['register', 'errorMessage'])
});

const RegisterFormReduxed = reduxForm({
  form: 'registerForm',
  enableReinitialize: true,
})(RegisterForm);


const RegisterFormMapped = connect(
  mapStateToProps
)(RegisterFormReduxed);

export default withStyles(styles)(RegisterFormMapped);
