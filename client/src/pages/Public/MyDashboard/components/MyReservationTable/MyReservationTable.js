import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import moment from 'moment';
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
import styles from './styles';

class MyReservationTable extends Component {
  state = {
    deleteDialogOpen: false,
    selectedReservation: null
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    reservations: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired,
    deleteReservation: PropTypes.func.isRequired
  };

  handleDeleteClick = (reservation) => {
    this.setState({
      deleteDialogOpen: true,
      selectedReservation: reservation
    });
  };

  handleDeleteConfirm = () => {
    const { selectedReservation } = this.state;
    if (selectedReservation) {
      this.props.deleteReservation(selectedReservation._id);
    }
    this.handleDeleteClose();
  };

  findCinema = (cinemaId) => {
    return this.props.cinemas.find(cinema => cinema._id === cinemaId);
  };

  findMovie = (movieId) => {
    return this.props.movies.find(movie => movie._id === movieId);
  };

  handleCancelReservation = async (reservationId) => {
    try {
      await this.props.deleteReservation(reservationId);
    } catch (error) {
      console.error('Ошибка при отмене бронирования:', error);
    }
  };

  render() {
    const { classes, reservations } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Фильм</TableCell>
              <TableCell>Зал</TableCell>
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
              const movie = this.findMovie(reservation.movieId);
              const cinema = this.findCinema(reservation.cinemaId);
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
                        onClick={() => this.handleCancelReservation(reservation._id)}
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
}

const mapDispatchToProps = { deleteReservation };

export default connect(null, mapDispatchToProps)(withStyles(styles)(MyReservationTable));
