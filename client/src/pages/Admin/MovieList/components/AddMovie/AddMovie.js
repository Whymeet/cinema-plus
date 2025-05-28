import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, Select } from '@material-ui/core';
import { Button, TextField, MenuItem } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styles from './styles';
import { genreData, languageData } from '../../../../../data/MovieDataService';
import {
  addMovie,
  updateMovie,
  removeMovie,
  uploadMovieImage,
  setAlert
} from '../../../../../store/actions';
import FileUpload from '../../../../../components/FileUpload/FileUpload';

class AddMovie extends Component {
  state = {
    title: '',
    image: null,
    imagePreview: null,
    imageUrl: '',
    genre: [],
    language: '',
    duration: '',
    description: '',
    director: '',
    cast: '',
    country: '',
    releaseDate: new Date(),
    endDate: new Date(),
    errors: {}
  };

  componentDidMount() {
    if (this.props.edit) {
      const {
        title,
        image,
        language,
        genre,
        director,
        cast,
        description,
        duration,
        country,
        releaseDate,
        endDate
      } = this.props.edit;
      this.setState({
        title,
        imageUrl: image,
        language,
        genre: genre.split(','),
        director,
        cast,
        description,
        duration,
        country,
        releaseDate,
        endDate
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.movie !== this.props.movie && this.props.movie) {
      const { title, genre, language } = this.props.movie;
      this.setState({ title, genre, language });
    }
    
    if (prevProps.movie && !this.props.movie) {
      this.setState({
        title: '',
        image: null,
        imagePreview: null,
        imageUrl: '',
        genre: [],
        language: '',
        duration: '',
        description: '',
        director: '',
        cast: '',
        country: '',
        releaseDate: new Date(),
        endDate: new Date(),
        errors: {}
      });
    }
  }

  handleChange = e => {
    this.setState({
      state: e.target.value
    });
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);

    // Если изменилось изображение, создаем превью
    if (field === 'image' && value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          imagePreview: reader.result,
          imageUrl: '' // Очищаем старый URL при выборе нового файла
        });
      };
      reader.readAsDataURL(value);
    }
  };

  validateFields = () => {
    const { title, genre, language, description, director, cast, country, duration } = this.state;
    const errors = {};
    
    if (!title) errors.title = 'Обязательное поле';
    if (!genre || genre.length === 0) errors.genre = 'Выберите хотя бы один жанр';
    if (!language) errors.language = 'Обязательное поле';
    if (!description) errors.description = 'Обязательное поле';
    if (!director) errors.director = 'Обязательное поле';
    if (!cast) errors.cast = 'Обязательное поле';
    if (!country) errors.country = 'Обязательное поле';
    if (!duration) errors.duration = 'Обязательное поле';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  onAddMovie = async () => {
    if (!this.validateFields()) {
      this.props.setAlert('Пожалуйста, заполните все обязательные поля', 'error', 5000);
      return;
    }

    const { image, genre, ...rest } = this.state;
    const movie = { ...rest, genre: genre.join(',') };
    await this.props.addMovie(image, movie);
  };

  onUpdateMovie = async () => {
    if (!this.validateFields()) {
      this.props.setAlert('Пожалуйста, заполните все обязательные поля', 'error', 5000);
      return;
    }

    if (!this.props.edit) {
      this.props.setAlert('Ошибка: Фильм для редактирования не найден', 'error', 5000);
      return;
    }

    const { image, genre, imagePreview, imageUrl, errors, ...rest } = this.state;
    const movie = { 
      ...rest, 
      genre: Array.isArray(genre) ? genre.join(',') : genre 
    };

    console.log('Отправляемые данные:', movie);

    const result = await this.props.updateMovie(image, movie, this.props.edit._id);
    
    if (result && result.status === 'success') {
      this.setState({
        imageUrl: result.data.image || imageUrl,
        imagePreview: null,
        image: null
      });
      if (this.props.onClose) {
        this.props.onClose();
      }
    }
  };

  onRemoveMovie = () => this.props.removeMovie(this.props.edit._id);

  render() {
    const { classes, className } = this.props;
    const {
      title,
      image,
      imagePreview,
      imageUrl,
      genre,
      language,
      duration,
      description,
      director,
      cast,
      country,
      releaseDate,
      endDate,
      errors
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const subtitle = this.props.edit ? 'Редактировать фильм' : 'Добавить фильм';
    const submitButton = this.props.edit ? 'Обновить фильм' : 'Сохранить';
    const submitAction = this.props.edit
      ? () => this.onUpdateMovie()
      : () => this.onAddMovie();

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {subtitle}
        </Typography>
        <form className={classes.form}>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Название фильма"
              margin="dense"
              required
              value={title}
              variant="outlined"
              error={!!errors.title}
              helperText={errors.title}
              onChange={event =>
                this.handleFieldChange('title', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <Select
              multiple
              displayEmpty
              className={classes.textField}
              label="Жанр"
              margin="dense"
              required
              value={genre}
              variant="outlined"
              error={!!errors.genre}
              onChange={event =>
                this.handleFieldChange('genre', event.target.value)
              }>
              {genreData.map((genreItem, index) => (
                <MenuItem key={genreItem + '-' + index} value={genreItem}>
                  {genreItem}
                </MenuItem>
              ))}
            </Select>
            {errors.genre && (
              <Typography color="error" variant="caption" className={classes.errorText}>
                {errors.genre}
              </Typography>
            )}
          </div>
          <div className={classes.field}>
            <TextField
              fullWidth
              multiline
              className={classes.textField}
              label="Описание"
              margin="dense"
              required
              variant="outlined"
              value={description}
              error={!!errors.description}
              helperText={errors.description}
              onChange={event =>
                this.handleFieldChange('description', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              select
              className={classes.textField}
              label="Язык"
              margin="dense"
              required
              value={language}
              variant="outlined"
              error={!!errors.language}
              helperText={errors.language}
              onChange={event =>
                this.handleFieldChange('language', event.target.value)
              }>
              {languageData.map((langItem, index) => (
                <MenuItem key={langItem + '-' + index} value={langItem}>
                  {langItem}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              className={classes.textField}
              label="Продолжительность (мин)"
              margin="dense"
              type="number"
              value={duration}
              variant="outlined"
              error={!!errors.duration}
              helperText={errors.duration}
              onChange={event =>
                this.handleFieldChange('duration', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Режиссер"
              margin="dense"
              required
              value={director}
              variant="outlined"
              error={!!errors.director}
              helperText={errors.director}
              onChange={event =>
                this.handleFieldChange('director', event.target.value)
              }
            />
            <TextField
              className={classes.textField}
              label="В ролях"
              margin="dense"
              required
              value={cast}
              variant="outlined"
              error={!!errors.cast}
              helperText={errors.cast}
              onChange={event =>
                this.handleFieldChange('cast', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Страна"
              margin="dense"
              required
              value={country}
              variant="outlined"
              error={!!errors.country}
              helperText={errors.country}
              onChange={event =>
                this.handleFieldChange('country', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="release-date"
                label="Дата выхода"
                value={releaseDate}
                onChange={date =>
                  this.handleFieldChange('releaseDate', date._d)
                }
                KeyboardButtonProps={{
                  'aria-label': 'изменить дату'
                }}
              />

              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="end-date"
                label="Дата окончания проката"
                value={endDate}
                onChange={date => this.handleFieldChange('endDate', date._d)}
                KeyboardButtonProps={{
                  'aria-label': 'изменить дату'
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className={classes.field}>
            <FileUpload
              className={classes.upload}
              file={image}
              preview={imagePreview || imageUrl}
              onUpload={event => {
                const file = event.target.files[0];
                this.handleFieldChange('image', file);
              }}
            />
          </div>
        </form>

        <Button
          className={classes.buttonFooter}
          color="primary"
          variant="contained"
          onClick={submitAction}>
          {submitButton}
        </Button>
        {this.props.edit && (
          <Button
            color="secondary"
            className={classes.buttonFooter}
            variant="contained"
            onClick={this.onRemoveMovie}>
            Удалить фильм
          </Button>
        )}
      </div>
    );
  }
}

AddMovie.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  edit: PropTypes.object,
  addMovie: PropTypes.func.isRequired,
  updateMovie: PropTypes.func.isRequired,
  removeMovie: PropTypes.func.isRequired,
  uploadMovieImage: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  onClose: PropTypes.func
};

const mapStateToProps = state => ({
  movie: state.movieState.selectedMovie
});
const mapDispatchToProps = {
  addMovie,
  updateMovie,
  removeMovie,
  uploadMovieImage,
  setAlert
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddMovie));
