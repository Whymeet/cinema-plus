import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Typography, Box, CircularProgress, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const CheckInPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.authState);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`/api/reservations/checkin/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setReservation(data);
          // Проверяем, является ли текущий пользователь владельцем билета
          if (user && user.username !== data.username) {
            setError('Вы не являетесь владельцем этого билета');
          }
        } else {
          setError(data.message || 'Билет не найден');
        }
      } catch (err) {
        setError('Ошибка при проверке билета');
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, user]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center" mt={5}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => history.push('/')}
          >
            Вернуться на главную
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Проверка билета
        </Typography>
        <Typography variant="h6" gutterBottom>
          Фильм: {reservation.movieId?.title || 'Не указан'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Кинотеатр: {reservation.cinemaId?.name || 'Не указан'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Дата: {new Date(reservation.date).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Время: {reservation.startAt}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Места: {reservation.seats.map(seat => `Ряд ${seat[0]+1}, Место ${seat[1]+1}`).join(', ')}
        </Typography>
        <Box mt={4}>
          <Typography variant="h5" color="primary">
            Билет подтвержден!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default CheckInPage;