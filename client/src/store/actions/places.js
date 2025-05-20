import { setAlert } from './alert';

export const getPlaces = cinemaId => async dispatch => {
  try {
    const url = `/places/${cinemaId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const places = await response.json();
    if (response.ok) {
      return places;
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const updatePlaceCoefficients = (cinemaId, coefficients) => async dispatch => {
  try {
    const url = `/places/${cinemaId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coefficients })
    });
    const result = await response.json();
    if (response.ok) {
      dispatch(setAlert('Коэффициенты успешно обновлены', 'success', 5000));
      return result;
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
}; 