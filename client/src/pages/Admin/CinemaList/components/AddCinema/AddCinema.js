import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField, Typography, Grid } from '@material-ui/core';
import styles from './styles';
import { Add, Settings } from '@material-ui/icons';
import {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas
} from '../../../../../store/actions';
import { updatePlaceCoefficients } from '../../../../../store/actions/places';
import { FileUpload } from '../../../../../components';
import PlaceCoefficients from '../PlaceCoefficients/PlaceCoefficients';

class AddCinema extends Component {
  state = {
    _id: '',
    name: '',
    image: null,
    basePrice: '',
    city: '',
    country: '',
    seatsAvailable: '',
    seats: [],
    notification: {},
    openCoefficientsDialog: false
  };

  componentDidMount() {
    if (this.props.editCinema) {
      const { image, ...rest } = this.props.editCinema;
      this.setState({ ...rest });
    }
  }

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  onSubmitAction = async type => {
    const {
      getCinemas,
      createCinemas,
      updateCinemas,
      removeCinemas
    } = this.props;
    const {
      _id,
      name,
      image,
      basePrice,
      city,
      country,
      seatsAvailable,
      seats
    } = this.state;
    const cinema = { name, basePrice, city, country, seatsAvailable, seats };
    let notification = {};
    type === 'create'
      ? (notification = await createCinemas(image, cinema))
      : type === 'update'
      ? (notification = await updateCinemas(image, cinema, _id))
      : (notification = await removeCinemas(_id));
    this.setState({ notification });
    if (notification && notification.status === 'success') getCinemas();
  };

  handleSeatsChange = (index, value) => {
    if (value > 10) return;
    const { seats } = this.state;
    seats[index] = Array.from({ length: value }, () => 0);
    this.setState({
      seats
    });
  };

  onAddSeatRow = () => {
    this.setState(prevState => ({
      seats: [...prevState.seats, []]
    }));
  };

  handleOpenCoefficientsDialog = () => {
    this.setState({ openCoefficientsDialog: true });
  };

  handleCloseCoefficientsDialog = () => {
    this.setState({ openCoefficientsDialog: false });
  };

  handleSaveCoefficients = async (coefficients) => {
    const { _id } = this.state;
    const result = await this.props.updatePlaceCoefficients(_id, coefficients);
    if (result) {
      this.handleCloseCoefficientsDialog();
    }
  };

  render() {
    const { classes, className } = this.props;
    const {
      name,
      image,
      basePrice,
      city,
      country,
      seatsAvailable,
      notification,
      openCoefficientsDialog
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const mainTitle = this.props.editCinema ? 'Редактировать кинотеатр' : 'Добавить кинотеатр';
    const submitButton = this.props.editCinema
      ? 'Обновить кинотеатр'
      : 'Сохранить';
    const submitAction = this.props.editCinema
      ? () => this.onSubmitAction('update')
      : () => this.onSubmitAction('create');

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {mainTitle}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Название"
              name="name"
              onChange={e => this.handleFieldChange('name', e.target.value)}
              value={name}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Базовая цена"
              name="basePrice"
              type="number"
              onChange={e => this.handleFieldChange('basePrice', e.target.value)}
              value={basePrice}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Город"
              name="city"
              onChange={e => this.handleFieldChange('city', e.target.value)}
              value={city}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Страна"
              name="country"
              onChange={e => this.handleFieldChange('country', e.target.value)}
              value={country}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Количество мест"
              name="seatsAvailable"
              type="number"
              onChange={e => this.handleFieldChange('seatsAvailable', e.target.value)}
              value={seatsAvailable}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FileUpload
              image={image}
              handleChange={file => this.handleFieldChange('image', file)}
            />
          </Grid>
          {this.props.editCinema && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Settings />}
                onClick={this.handleOpenCoefficientsDialog}
              >
                Управление коэффициентами цен
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={submitAction}
            >
              {submitButton}
            </Button>
          </Grid>
        </Grid>
        <PlaceCoefficients
          open={openCoefficientsDialog}
          onClose={this.handleCloseCoefficientsDialog}
          onSave={this.handleSaveCoefficients}
          cinema={this.props.editCinema}
        />
      </div>
    );
  }
}

AddCinema.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  editCinema: PropTypes.object
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas,
  updatePlaceCoefficients
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddCinema));
