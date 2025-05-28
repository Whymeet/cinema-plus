import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { withStyles } from '@material-ui/core';
import { Avatar, Typography, Button } from '@material-ui/core';
import {
  Portlet,
  PortletContent,
  PortletFooter
} from '../../../../../components';

// Component styles
import styles from './styles';

class AccountProfile extends Component {
  render() {
    const { user, classes, className, file, imagePreview, onUpload } = this.props;
    const rootClassName = classNames(classes.root, className);

    if (!user) {
      return (
        <Portlet className={rootClassName}>
          <PortletContent>
            <Typography variant="body1">Загрузка данных...</Typography>
          </PortletContent>
        </Portlet>
      );
    }

    return (
      <Portlet className={rootClassName}>
        <PortletContent>
          <div className={classes.details}>
            <div className={classes.info}>
              <Typography variant="h2">{user.name || 'Без имени'}</Typography>
              <Typography className={classes.emailText} variant="body1">
                {user.email || 'Email не указан'}
              </Typography>
              <Typography className={classes.dateText} variant="body1">
                Дата регистрации: {user.createdAt ? moment(user.createdAt).format('DD/MM/YYYY') : 'Не указана'}
              </Typography>
            </div>
            <Avatar
              className={classes.avatar}
              src={imagePreview || '/images/avatars/avatar.png'}
            />
          </div>
        </PortletContent>
        <PortletFooter>
          <input
            accept="image/*"
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={onUpload}
          />
          <label htmlFor="icon-button-file">
            <Button
              className={classes.uploadButton}
              component="span"
              color="primary"
              variant="text">
              {file ? 'Изменить фото' : 'Загрузить фото'}
            </Button>
          </label>
          <span>{file && file.name}</span>
        </PortletFooter>
      </Portlet>
    );
  }
}

AccountProfile.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  file: PropTypes.object,
  imagePreview: PropTypes.string,
  onUpload: PropTypes.func.isRequired
};

export default withStyles(styles)(AccountProfile);
