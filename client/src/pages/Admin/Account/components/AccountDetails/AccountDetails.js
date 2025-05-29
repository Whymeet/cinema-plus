import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from '../../../../../components';

// Component styles
import styles from './styles';

class Account extends Component {
  state = {
    name: '',
    email: '',
    phone: '',
    password: '',
    phoneError: '',
    emailError: '',
    alert: {
      open: false,
      message: '',
      severity: 'success'
    }
  };

  componentDidMount() {
    const { name, email, phone } = this.props.user;
    this.setState({ name, email, phone });
  }

  validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+7\d{10}$/;
    return phoneRegex.test(phone);
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    
    // Очищаем ошибку при изменении номера
    if (field === 'phone') {
      newState.phoneError = '';
    }
    
    this.setState(newState);
  };

  handleCloseAlert = () => {
    this.setState({
      alert: {
        ...this.state.alert,
        open: false
      }
    });
  };

  showAlert = (message, severity = 'success') => {
    this.setState({
      alert: {
        open: true,
        message,
        severity
      }
    });
  };

  onUpdateUser = async () => {
    try {
      const { name, email, phone, password } = this.state;

      // Проверяем формат телефона перед отправкой
      if (phone && !this.validatePhoneNumber(phone)) {
        this.setState({ 
          phoneError: 'Введите номер в формате +7XXXXXXXXXX' 
        });
        return;
      }

      const token = localStorage.getItem('jwtToken');
      let body = { name, email, phone };
      if (password) body = { ...body, password };
      const url = '/users/me';
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        const user = await response.json();
        if (this.props.file) this.props.uploadImage(user._id, this.props.file);
        this.showAlert('Профиль успешно обновлен', 'success');
        // Очищаем ошибки
        this.setState({ emailError: '', phoneError: '' });
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          if (errorData.error.includes('Email')) {
            this.setState({ emailError: errorData.error });
            this.showAlert(errorData.error, 'error');
          } else {
            this.showAlert(errorData.error, 'error');
          }
        }
      }
    } catch (error) {
      console.log(error);
      this.showAlert('Произошла ошибка при обновлении профиля', 'error');
    }
  };

  render() {
    const { classes, className } = this.props;
    const { name, phone, email, password, alert } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName}>
        <PortletHeader>
          <PortletLabel
            subtitle="Информацию можно изменять"
            title="Профиль"
          />
        </PortletHeader>
        <PortletContent noPadding>
          <form autoComplete="off" noValidate>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Полное имя"
                margin="dense"
                required
                value={name}
                variant="outlined"
                onChange={event =>
                  this.handleFieldChange('name', event.target.value)
                }
              />
              <TextField
                className={classes.textField}
                label="Email адрес"
                margin="dense"
                required
                value={email}
                variant="outlined"
                error={!!this.state.emailError}
                helperText={this.state.emailError}
                onChange={event =>
                  this.handleFieldChange('email', event.target.value)
                }
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Номер телефона"
                margin="dense"
                type="text"
                value={phone}
                variant="outlined"
                placeholder="+7XXXXXXXXXX"
                error={!!this.state.phoneError}
                helperText={this.state.phoneError || "Введите номер в формате +7XXXXXXXXXX"}
                onChange={event =>
                  this.handleFieldChange('phone', event.target.value)
                }
              />
              <TextField
                className={classes.textField}
                label="Пароль"
                margin="dense"
                type="password"
                value={password}
                variant="outlined"
                onChange={event =>
                  this.handleFieldChange('password', event.target.value)
                }
              />
            </div>
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            variant="contained"
            className={classes.buttonFooter}
            onClick={this.onUpdateUser}>
            Сохранить
          </Button>
        </PortletFooter>
        <Snackbar 
          open={alert.open} 
          autoHideDuration={6000} 
          onClose={this.handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert 
            onClose={this.handleCloseAlert} 
            severity={alert.severity}
            variant="filled"
          >
            {alert.message}
          </MuiAlert>
        </Snackbar>
      </Portlet>
    );
  }
}

Account.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default withStyles(styles)(Account);
