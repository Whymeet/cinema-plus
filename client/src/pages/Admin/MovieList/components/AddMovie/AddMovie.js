import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, Select, FormControl, InputLabel } from '@material-ui/core';
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
  uploadMovieImage
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
    endDate: new Date()
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
    if (prevProps.movie !== this.props.movie) {
      const { title, genre, language } = this.props.movie;
      this.setState({ title, genre, language });
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

  onAddMovie = async () => {
    const { image, genre, ...rest } = this.state;
    const movie = { ...rest, genre: genre.join(',') };
    await this.props.addMovie(image, movie);
  };

  onUpdateMovie = async () => {
    const { image, genre, ...rest } = this.state;
    const movie = { ...rest, genre: genre.join(',') };
    // Сначала обновляем основные данные без изображения
    await this.props.updateMovie(null, movie, this.props.edit._id);
    
    // Если есть новое изображение, загружаем его отдельно
    if (image) {
      const imageResponse = await this.props.uploadMovieImage(this.props.edit._id, image);
      if (imageResponse && imageResponse.movie) {
        this.setState({
          imageUrl: imageResponse.movie.image,
          imagePreview: null,
          image: null // Очищаем выбранный файл
        });
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
      endDate
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
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText="Пожалуйста, укажите название фильма"
              label="Название"
              margin="dense"
              required
              value={title}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('title', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <FormControl variant="outlined" className={classes.textField}>
              <InputLabel id="genre-label">Жанр*</InputLabel>
              <Select
                labelId="genre-label"
                multiple
                displayEmpty
                label="Жанр*"
                margin="dense"
                required
                value={genre}
                onChange={event =>
                  this.handleFieldChange('genre', event.target.value)
                }>
                {genreData.map((genreItem, index) => (
                  <MenuItem key={genreItem + '-' + index} value={genreItem}>
                    {genreItem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              label="Продолжительность"
              margin="dense"
              type="number"
              value={duration}
              variant="outlined"
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
  uploadMovieImage: PropTypes.func.isRequired
};

const mapStateToProps = null;
const mapDispatchToProps = {
  addMovie,
  updateMovie,
  removeMovie,
  uploadMovieImage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddMovie));
