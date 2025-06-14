import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';
import ResponsiveMovieCard from '../components/ResponsiveMovieCard/ResponsiveMovieCard';
import { getMovies } from '../../../store/actions';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '3rem',
    lineHeight: '3rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(3),
  },
  filterContainer: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  moviesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    justifyItems: 'center'
  },
  resetButton: {
    height: '56px', // Высота как у TextField и Select
    marginTop: 0,
    fontSize: '1.1rem', // Увеличиваем размер текста
    '& .MuiButton-label': {
      fontSize: '1.1rem', // Для гарантии применения размера
    }
  },
  select: {
    '& .MuiSelect-select': {
      fontSize: '1.1rem',
    },
    '& .MuiMenuItem-root': {
      fontSize: '1.1rem',
    }
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#0767DB !important',
      color: '#ffffff'
    },
    '&.Mui-selected': {
      backgroundColor: '#0767DB !important',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#0767DB !important',
        color: '#ffffff'
      }
    }
  },
  [theme.breakpoints.down('sm')]: {
    fullWidth: { width: '100%' },
  },
}));

function MovieCategoryPage(props) {
  const { movies, getMovies } = props;
  const category = props.match.params.category;
  const classes = useStyles();

  // Состояние для фильтров
  const [titleFilter, setTitleFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('Все');
  const [countryFilter, setCountryFilter] = useState('Все');
  const [genres, setGenres] = useState(['Все']);
  const [countries, setCountries] = useState(['Все']);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка фильмов
  useEffect(() => {
    if (!movies.length) {
      setIsLoading(true);
      getMovies().finally(() => setIsLoading(false));
    }
  }, [movies, getMovies]);

  // Извлечение уникальных жанров и стран
  useEffect(() => {
    if (movies.length > 0) {
      const allGenres = movies
        .flatMap((movie) => movie.genre.split(','))
        .filter((genre, index, self) => self.indexOf(genre) === index);
      setGenres(['Все', ...allGenres]);

      const allCountries = movies
        .map((movie) => movie.country)
        .filter((country, index, self) => self.indexOf(country) === index);
      setCountries(['Все', ...allCountries]);
    }
  }, [movies]);

  // Фильтрация фильмов
  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      (genreFilter === 'Все' || movie.genre.includes(genreFilter)) &&
      (countryFilter === 'Все' || movie.country === countryFilter)
  );

  // Перевод категорий на русский
  const getCategoryTitle = (category) => {
    switch (category) {
      case 'nowShowing':
        return 'Афиша';
      case 'comingSoon':
        return 'Скоро в кино';
      default:
        return category;
    }
  };

  return (
    <Grid container spacing={2}>
      {isLoading ? (
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Загрузка...
          </Typography>
        </Grid>
      ) : !['nowShowing', 'comingSoon'].includes(category) ? (
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h2" color="inherit">
            Категория не существует
          </Typography>
        </Grid>
      ) : (
        <>
          <Grid item xs={12}>
            <Typography className={classes.title} variant="h2" color="inherit">
              {getCategoryTitle(category)}
            </Typography>
          </Grid>
          {/* Фильтры */}
          <Grid container spacing={2} className={classes.filterContainer}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Фильтр по названию фильма"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                displayEmpty
                fullWidth
                variant="outlined"
                className={classes.select}
                MenuProps={{
                  classes: { paper: classes.select },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left'
                  },
                  getContentAnchorEl: null
                }}
              >
                {genres.map((genre, index) => (
                  <MenuItem key={index} value={genre} className={classes.menuItem}>
                    {genre || 'Выберите жанр'}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                displayEmpty
                fullWidth
                variant="outlined"
                className={classes.select}
                MenuProps={{
                  classes: { paper: classes.select },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left'
                  },
                  getContentAnchorEl: null
                }}
              >
                {countries.map((country, index) => (
                  <MenuItem key={index} value={country} className={classes.menuItem}>
                    {country || 'Выберите страну'}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setTitleFilter('');
                  setGenreFilter('Все');
                  setCountryFilter('Все');
                }}
                fullWidth
                className={classes.resetButton}
              >
                Сбросить
              </Button>
            </Grid>
          </Grid>
          {/* Список фильмов */}
          <Grid
            container
            spacing={3}
            className={classes.moviesContainer}
          >
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <Grid
                  key={movie._id}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  <ResponsiveMovieCard movie={movie} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" color="inherit" align="center">
                  Фильмы не найдены
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
}

const mapStateToProps = ({ movieState }, ownProps) => ({
  movies: movieState[ownProps.match.params.category] || [],
});

const mapDispatchToProps = { getMovies };

export default connect(mapStateToProps, mapDispatchToProps)(MovieCategoryPage);
