import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Button, Avatar } from '@material-ui/core';
import styles from './styles';
import classNames from 'classnames';
import bActive from '../../../../../assets/images/b_active.png';
import bNoactive from '../../../../../assets/images/b_noactive.png';

const AccountProfile = ({ classes, className, user, uploadImage, onToggleView, showReservations }) => {
  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file && user._id) {
      uploadImage(user._id, file);
    }
  };

  return (
    <div className={classNames(classes.root, className)}>
      <div className={classes.details}>
        <div className={classes.info}>
          <Typography className={classes.nameText} variant="h3">
            {user.name}
          </Typography>
          <Typography className={classes.emailText} variant="h6">
            {user.email}
          </Typography>
          <Typography className={classes.dateText}>
            Зарегистрирован: {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
        </div>
        <Avatar
          className={classes.avatar}
          src={user.imageurl ? user.imageurl : '/images/avatars/avatar.png'}
        />
      </div>
      <div className={classes.actions}>
        <input
          accept="image/*"
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleFileSelect}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            fullWidth
            className={classes.uploadButton}
          >
            Загрузить фото
          </Button>
        </label>
        <img
          src={showReservations ? bActive : bNoactive}
          alt="Toggle view"
          className={classes.toggleButton}
          onClick={onToggleView}
        />
      </div>
    </div>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired,
  onToggleView: PropTypes.func.isRequired,
  showReservations: PropTypes.bool.isRequired
};

export default withStyles(styles)(AccountProfile);
