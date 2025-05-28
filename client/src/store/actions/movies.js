import { GET_MOVIES, SELECT_MOVIE,GET_SUGGESTIONS } from '../types';
import { setAlert } from './alert';

export const uploadMovieImage = (id, image) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const data = new FormData();
    data.append('file', image);
    const url = `/movies/photo/${id}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: data
    });
    const responseData = await response.json(); 
    if (response.ok) {
      dispatch(setAlert('Изображение загружено', 'success', 5000));
      // Получаем обновленные данные фильма
      await dispatch(getMovies());
      return responseData;
    }
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
    return null;
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return null;
  }
};

export const getMovies = () => async dispatch => {
  try {
    const url = '/movies';
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movies = await response.json();
    if (response.ok) {
      dispatch({ type: GET_MOVIES, payload: movies });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const onSelectMovie = movie => ({
  type: SELECT_MOVIE,
  payload: movie
});

export const getMovie = id => async dispatch => {
  try {
    const url = '/movies/' + id;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movie = await response.json();
    if (response.ok) {
      dispatch({ type: SELECT_MOVIE, payload: movie });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getMovieSuggestion = id => async dispatch => {
  try {
    const url = '/movies/usermodeling/' + id;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movies = await response.json();
    if (response.ok) {
      dispatch({ type: GET_SUGGESTIONS, payload: movies });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const addMovie = (image, newMovie) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/movies';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMovie)
    });
    const movie = await response.json();
    if (response.ok) {
      dispatch(setAlert('Фильм успешно сохранен!', 'success', 5000));
      if (image) dispatch(uploadMovieImage(movie._id, image));
      dispatch(getMovies());
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const updateMovie = (image, movie, movieId) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/movies/' + movieId;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      dispatch(onSelectMovie(null));
      dispatch(setAlert('Фильм успешно обновлен!', 'success', 5000));
      if (image) dispatch(uploadMovieImage(movieId, image));
      dispatch(getMovies());
      return { status: 'success', data };
    } else {
      const errorMessage = data.error || 'Не удалось обновить фильм. Пожалуйста, проверьте данные.';
      dispatch(setAlert(errorMessage, 'error', 5000));
      return { status: 'error', message: errorMessage };
    }
  } catch (error) {
    const errorMessage = 'Ошибка при обновлении фильма: ' + (error.message || 'Неизвестная ошибка');
    dispatch(setAlert(errorMessage, 'error', 5000));
    return { status: 'error', message: errorMessage };
  }
};

export const removeMovie = movieId => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/movies/' + movieId;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      dispatch(getMovies());
      dispatch(onSelectMovie(null));
      dispatch(setAlert('Movie have been Deleted!', 'success', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};
