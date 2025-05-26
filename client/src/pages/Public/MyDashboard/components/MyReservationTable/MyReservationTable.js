import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper
} from '@material-ui/core';
import { connect } from 'react-redux';
import { deleteReservation } from '../../../../../store/actions';
import moment from 'moment';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  button: {
    margin: theme.spacing(1)
  }
});

function MyReservationTable(props) {
  const { classes, reservations, movies, cinemas, deleteReservation } = props;

  const findMovie = movieId => {
    return movies.find(movie => movie._id === movieId);
  };

  const findCinema = cinemaId => {
    return cinemas.find(cinema => cinema._id === cinemaId);
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await deleteReservation(reservationId);
    } catch (error) {
      console.error('Ошибка при отмене бронирования:', error);
    }
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Фильм</TableCell>
            <TableCell>Кинотеатр</TableCell>
            <TableCell>Дата</TableCell>
            <TableCell>Время</TableCell>
            <TableCell>Места</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map(reservation => {
            const movie = findMovie(reservation.movieId);
            const cinema = findCinema(reservation.cinemaId);
            return (
              <TableRow key={reservation._id}>
                <TableCell>{movie ? movie.title : 'Загрузка...'}</TableCell>
                <TableCell>{cinema ? cinema.name : 'Загрузка...'}</TableCell>
                <TableCell>
                  {moment(reservation.date).format('DD.MM.YYYY')}
                </TableCell>
                <TableCell>{reservation.startAt}</TableCell>
                <TableCell>
                  {reservation.seats.map(seat => `${seat.row}-${seat.col}`).join(', ')}
                </TableCell>
                <TableCell>{reservation.total} ₽</TableCell>
                <TableCell>
                  {reservation.checkin ? (
                    <Typography color="primary">Использовано</Typography>
                  ) : (
                    <Typography color="secondary">Активно</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {!reservation.checkin && (
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      onClick={() => handleCancelReservation(reservation._id)}
                    >
                      Отменить
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

MyReservationTable.propTypes = {
  classes: PropTypes.object.isRequired,
  reservations: PropTypes.array.isRequired,
  movies: PropTypes.array.isRequired,
  cinemas: PropTypes.array.isRequired,
  deleteReservation: PropTypes.func.isRequired
};

const mapDispatchToProps = { deleteReservation };

export default connect(null, mapDispatchToProps)(withStyles(styles)(MyReservationTable));
