import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
import { connect } from 'react-redux';
import { deleteReservation } from '../../../../../store/actions';
import moment from 'moment';
import { EventSeat, AccessTime, LocationOn } from '@material-ui/icons';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  card: {
    marginBottom: theme.spacing(2),
    position: 'relative',
    overflow: 'visible'
  },
  cardContent: {
    display: 'flex',
    padding: theme.spacing(3)
  },
  posterContainer: {
    width: 140,
    marginRight: theme.spacing(3)
  },
  poster: {
    width: '100%',
    height: 200,
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  infoContainer: {
    flex: 1
  },
  qrContainer: {
    width: 120,
    marginLeft: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  qrCode: {
    width: '100%',
    height: 120,
    marginBottom: theme.spacing(1)
  },
  movieTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2)
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  seats: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2)
  },
  seatChip: {
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    '& .MuiChip-label': {
      color: '#fff',
      fontWeight: 500
    },
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  statusChip: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2)
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 500,
    color: theme.palette.success.main,
    marginTop: theme.spacing(2)
  },
  cancelButton: {
    marginTop: theme.spacing(2),
    width: '100%',
    fontSize: '0.8rem'
  }
});

function MyReservationTable(props) {
  const { classes, reservations, movies, cinemas, deleteReservation } = props;
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    reservationId: null
  });

  const findMovie = movieId => {
    return movies.find(movie => movie._id === movieId);
  };

  const findCinema = cinemaId => {
    return cinemas.find(cinema => cinema._id === cinemaId);
  };

  const handleCancelClick = (reservationId) => {
    setConfirmDialog({
      open: true,
      reservationId
    });
  };

  const handleConfirmCancel = async () => {
    try {
      await deleteReservation(confirmDialog.reservationId);
      setConfirmDialog({
        open: false,
        reservationId: null
      });
    } catch (error) {
      console.error('Ошибка при отмене бронирования:', error);
      setConfirmDialog({
        open: false,
        reservationId: null
      });
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      open: false,
      reservationId: null
    });
  };

  return (
    <>
      <Grid container className={classes.root} spacing={3}>
        {reservations.map(reservation => {
          const movie = findMovie(reservation.movieId);
          const cinema = findCinema(reservation.cinemaId);
          
          return (
            <Grid item xs={12} key={reservation._id}>
              <Card className={classes.card} elevation={2}>
                <Chip
                  label={reservation.checkin ? "Использовано" : "Активно"}
                  color={reservation.checkin ? "default" : "secondary"}
                  className={classes.statusChip}
                />
                <CardContent className={classes.cardContent}>
                  <div className={classes.posterContainer}>
                    <CardMedia
                      component="img"
                      className={classes.poster}
                      image={movie ? movie.image : 'https://via.placeholder.com/140x200?text=Постер'}
                      title={movie ? movie.title : 'Загрузка...'}
                    />
                  </div>

                  <div className={classes.infoContainer}>
                    <Typography variant="h5" className={classes.movieTitle}>
                      {movie ? movie.title : 'Загрузка...'}
                    </Typography>

                    <div className={classes.infoRow}>
                      <LocationOn className={classes.icon} />
                      <Typography variant="body1">
                        {cinema ? cinema.name : 'Загрузка...'}
                      </Typography>
                    </div>

                    <div className={classes.infoRow}>
                      <AccessTime className={classes.icon} />
                      <Typography variant="body1">
                        {moment(reservation.date).format('DD.MM.YYYY')} в {reservation.startAt}
                      </Typography>
                    </div>

                    <div className={classes.infoRow}>
                      <EventSeat className={classes.icon} />
                      <Typography variant="body1">Места:</Typography>
                    </div>

                    <div className={classes.seats}>
                      {reservation.seats.map((seat, index) => {
                        const row = Array.isArray(seat) ? seat[0] + 1 : seat.row;
                        const seatNumber = Array.isArray(seat) ? seat[1] + 1 : seat.number;
                        return (
                          <Chip
                            key={index}
                            label={`Ряд ${row}, Место ${seatNumber}`}
                            className={classes.seatChip}
                            size="small"
                          />
                        );
                      })}
                    </div>

                    <Typography variant="h6" className={classes.price}>
                      {reservation.total} ₽
                    </Typography>
                  </div>

                  <div className={classes.qrContainer}>
                    {!reservation.checkin && (
                      <>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${reservation._id}`}
                          alt="QR код билета"
                          className={classes.qrCode}
                        />
                        <Typography variant="caption" align="center">
                          QR код для входа
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          className={classes.cancelButton}
                          onClick={() => handleCancelClick(reservation._id)}
                        >
                          Отменить бронирование
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Подтверждение отмены
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы действительно хотите отменить бронирование? Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConfirmCancel} color="secondary" variant="contained" autoFocus>
            Подтвердить отмену
          </Button>
        </DialogActions>
      </Dialog>
    </>
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
