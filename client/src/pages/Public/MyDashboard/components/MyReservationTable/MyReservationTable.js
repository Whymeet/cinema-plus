import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {

  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { Portlet, PortletContent } from '../../../../../components';
import styles from './styles';

class ReservationsTable extends Component {
  state = {
    deleteDialogOpen: false,
    selectedReservation: null
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    onShowDetails: PropTypes.func,
    reservations: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired,
    onDeleteReservation: PropTypes.func.isRequired
  };

  static defaultProps = {
    reservations: [],
    movies: [],
    cinemas: [],
    onSelect: () => {},
    onShowDetails: () => {},
    onDeleteReservation: () => {}
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
      this.props.onDeleteReservation(selectedReservation._id);
    }
    this.handleDeleteClose();
  };

  handleDeleteClose = () => {
    this.setState({
      deleteDialogOpen: false,
      selectedReservation: null
    });

  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await deleteReservation(reservationId);
    } catch (error) {
      console.error('Ошибка при отмене бронирования:', error);
    }
  };


  render() {
    const { classes, className, reservations, movies, cinemas } = this.props;
    const { deleteDialogOpen } = this.state;
    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <div className={classes.cardsContainer}>
            {reservations.map(reservation => {
              const movie = movies.find(m => m._id === reservation.movieId) || {};
              return (
                <Card key={reservation._id} className={classes.card}>
                  <CardContent>
                    <div className={classes.cardHeader}>
                      <Typography variant="h6">
                        Заказ {reservation._id}
                      </Typography>
                      <Typography variant="h6" className={classes.total}>
                        Итого: {reservation.total} руб.
                      </Typography>
                    </div>
                    <div className={classes.cardContent}>
                      <div className={classes.posterContainer}>
                        {movie.image && (
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className={classes.poster}
                          />
                        )}
                      </div>
                      <div className={classes.infoContainer}>
                        <Typography variant="h6">
                          {this.onFindAttr(reservation.movieId, movies, 'title')}
                        </Typography>
                        <Typography>
                          Кинотеатр: {this.onFindAttr(reservation.cinemaId, cinemas, 'name')}
                        </Typography>
                        <Typography>
                          Дата: {new Date(reservation.date).toLocaleDateString()}
                        </Typography>
                        <Typography>
                          Начало: {reservation.startAt}
                        </Typography>
                        <Typography>
                          Места: {reservation.seats.map((seat, index) => {
                            const seatRow = (seat.row || seat.seatRow || seat[0] || 0) + 1;
                            const seatNumber = (seat.number || seat.seatNumber || seat[1] || 0) + 1;
                            return `Ряд ${seatRow}, Место ${seatNumber}${index < reservation.seats.length - 1 ? '; ' : ''}`;
                          })}
                        </Typography>
                      </div>
                      <div className={classes.qrContainer}>
                        {reservation.qrCode && (
                          <img
                            src={reservation.qrCode}
                            alt="QR код"
                            className={classes.qrCode}
                          />
                        )}
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => this.handleDeleteClick(reservation)}
                          className={classes.deleteButton}
                        >
                          Отменить бронь
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </PortletContent>

        <Dialog
          open={deleteDialogOpen}
          onClose={this.handleDeleteClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          disablePortal
          keepMounted
        >
          <DialogTitle id="delete-dialog-title">Подтверждение отмены</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Действительно ли вы хотите отменить бронь?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteClose} color="primary">
              Отмена
            </Button>
            <Button 
              onClick={this.handleDeleteConfirm} 
              color="secondary" 
              variant="contained"
            >
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </Portlet>
    );
  }

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
