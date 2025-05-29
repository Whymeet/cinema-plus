import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import { setAlert } from '../../../../../store/actions';
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
    phoneError: ''
  };

  componentDidMount() {
    const { name, email, phone } = this.props.user;
    this.setState({ name, email, phone });
  }

  validatePhoneNumber = (phone) => {
    if (!phone) return true; // Разрешаем пустое значение
    
    // Очищаем номер от всех символов кроме цифр
    const cleanedNumber = phone.replace(/\D/g, '');
    
    // Проверяем базовые требования:
    // - Начинается с 7
    // - Имеет 11 цифр в общей сложности
    return cleanedNumber.length === 11 && cleanedNumber.startsWith('7');
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    
    // Очищаем ошибку при изменении номера
    if (field === 'phone') {
      if (value && !this.validatePhoneNumber(value)) {
        newState.phoneError = 'Неверный формат номера телефона. Используйте формат: +7XXXXXXXXXX';
      } else {
        newState.phoneError = '';
      }
    }
    
    this.setState(newState);
  };

  onUpdateUser = async () => {
    try {
      const { name, email, phone, password } = this.state;

      // Проверяем формат телефона перед отправкой
      if (phone && !this.validatePhoneNumber(phone)) {
        this.setState({ 
          phoneError: 'Неверный формат номера телефона. Используйте формат: +7XXXXXXXXXX' 
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
        this.props.setAlert('Профиль успешно обновлен', 'success', 5000);
      } else {
        const error = await response.json();
        this.props.setAlert(error.message || 'Ошибка при обновлении профиля', 'error', 5000);
      }
    } catch (error) {
      console.log(error);
      this.props.setAlert('Ошибка при обновлении профиля', 'error', 5000);
    }
  };

  render() {
    const { classes, className } = this.props;
    const { name, phone, email, password, phoneError } = this.state;

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
                error={!!phoneError}
                helperText={phoneError || "Неверный формат номера телефона. Используйте формат: +7XXXXXXXXXX"}
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
      </Portlet>
    );
  }
}

Account.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  setAlert
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Account));
