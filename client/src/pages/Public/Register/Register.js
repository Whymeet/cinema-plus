import React, { Component } from 'react';
import { connect } from 'react-redux';
import { register, setAlert } from '../../../store/actions';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import styles from './styles';
import FileUpload from '../../../components/FileUpload/FileUpload';

class Register extends Component {
  state = {
    values: {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      image: null,
      policy: false
    },
    usernameError: '',
    passwordError: ''
  };

  componentDidUpdate(prevProps) {
    const { isAuthenticated, history } = this.props;
    if (prevProps.isAuthenticated !== isAuthenticated || isAuthenticated)
      history.push('/');
  }

  handleBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState.values[field] = value;
    
    // Валидация длины имени пользователя
    if (field === 'username') {
      if (value.length < 3) {
        newState.usernameError = 'Имя пользователя должно содержать минимум 3 символа';
      } else if (value.length > 10) {
        newState.usernameError = 'Имя пользователя не должно превышать 10 символов';
      } else {
        newState.usernameError = '';
      }
    }

    // Валидация длины пароля
    if (field === 'password') {
      if (value.length < 5) {
        newState.passwordError = 'Пароль должен содержать минимум 5 символов';
      } else if (value.length > 15) {
        newState.passwordError = 'Пароль не должен превышать 15 символов';
      } else {
        newState.passwordError = '';
      }
    }
    
    this.setState(newState);
  };

  handleRegister = () => {
    const { values, usernameError, passwordError } = this.state;
    
    if (usernameError) {
      this.props.dispatch(setAlert(usernameError, 'error', 5000));
      return;
    }

    if (passwordError) {
      this.props.dispatch(setAlert(passwordError, 'error', 5000));
      return;
    }
    
    const newUser = values;
    this.props.register(newUser);
  };

  render() {
    const { classes } = this.props;
    const { values } = this.state;

    const isValid = values.policy;

    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid className={classes.bgWrapper} item lg={5}>
            <div className={classes.bg} />
          </Grid>
          <Grid className={classes.content} item lg={7} xs={12}>
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <IconButton
                  className={classes.backButton}
                  onClick={this.handleBack}>
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography className={classes.title} variant="h2">
                    Создание нового аккаунта
                  </Typography>
                  <Typography className={classes.subtitle} variant="body1">
                    Используйте свою электронную почту для создания нового аккаунта. Это бесплатно.
                  </Typography>
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="Полное имя"
                      name="name"
                      value={values.name}
                      onChange={event =>
                        this.handleFieldChange('name', event.target.value)
                      }
                      variant="outlined"
                    />
                    <TextField
                      className={classes.textField}
                      label="Имя пользователя"
                      name="username"
                      value={values.username}
                      onChange={event =>
                        this.handleFieldChange('username', event.target.value)
                      }
                      error={!!this.state.usernameError}
                      helperText={this.state.usernameError}
                      variant="outlined"
                    />
                    <TextField
                      className={classes.textField}
                      label="Электронная почта"
                      name="email"
                      value={values.email}
                      onChange={event =>
                        this.handleFieldChange('email', event.target.value)
                      }
                      variant="outlined"
                    />
                    <TextField
                      className={classes.textField}
                      label="Мобильный телефон"
                      name="phone"
                      value={values.phone}
                      variant="outlined"
                      onChange={event =>
                        this.handleFieldChange('phone', event.target.value)
                      }
                    />
                    <TextField
                      className={classes.textField}
                      label="Пароль"
                      type="password"
                      value={values.password}
                      variant="outlined"
                      error={!!this.state.passwordError}
                      helperText={this.state.passwordError}
                      onChange={event =>
                        this.handleFieldChange('password', event.target.value)
                      }
                    />
                    <FileUpload
                      className={classes.upload}
                      file={values.image}
                      onUpload={event => {
                        const file = event.target.files[0];
                        this.handleFieldChange('image', file);
                      }}
                    />
                    <div className={classes.policy}>
                      <Checkbox
                        checked={values.policy}
                        className={classes.policyCheckbox}
                        color="primary"
                        name="policy"
                        onChange={() =>
                          this.handleFieldChange('policy', !values.policy)
                        }
                      />
                      <Typography
                        className={classes.policyText}
                        variant="body1">
                        Я прочитал(а) &nbsp;
                        <Link className={classes.policyUrl} to="#">
                          Условия использования
                        </Link>
                        .
                      </Typography>
                    </div>
                  </div>

                  <Button
                    className={classes.registerButton}
                    color="primary"
                    disabled={!isValid}
                    onClick={this.handleRegister}
                    size="large"
                    variant="contained">
                    Зарегистрироваться
                  </Button>

                  <Typography className={classes.login} variant="body1">
                    Уже есть аккаунт?{' '}
                    <Link className={classes.loginUrl} to="/login">
                      Войти
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Register.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated
});

export default withStyles(styles)(
  connect(mapStateToProps, { register })(Register)
);
