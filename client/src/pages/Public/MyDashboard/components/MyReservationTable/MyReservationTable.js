import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TablePagination,
  Box,
  CircularProgress
} from '@material-ui/core';
import { Portlet, PortletContent } from '../../../../../components';
import styles from './styles';

class ReservationsTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    reservations: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired
  };

  static defaultProps = {
    reservations: [],
    movies: [],
    cinemas: []
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  onFindAttr = (id, list, attr) => {
    if (!id || !list || !list.length) return 'Не найдено';
    const item = list.find(item => item._id === id);
    return item ? item[attr] : 'Не найдено';
  };

  render() {
    const { classes, reservations, movies, cinemas } = this.props;
    const { rowsPerPage, page } = this.state;

    if (!reservations || !reservations.length) {
      return (
        <Portlet>
          <PortletContent>
            <Typography variant="body1">У вас нет активных бронирований</Typography>
          </PortletContent>
        </Portlet>
      );
    }

    return (
      <Portlet>
        <PortletContent>
          <Grid container spacing={3}>
            {reservations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(reservation => (
                <Grid item xs={12} sm={6} md={4} key={reservation._id || Math.random()}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom>
                            {this.onFindAttr(reservation.movieId, movies, 'title')}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            {this.onFindAttr(reservation.cinemaId, cinemas, 'name')}
                          </Typography>
                          <Typography variant="body2">
                            Дата: {reservation.date ? new Date(reservation.date).toLocaleDateString() : 'Не указана'}
                          </Typography>
                          <Typography variant="body2">
                            Время: {reservation.startAt || 'Не указано'}
                          </Typography>
                          <Typography variant="body2">
                            Цена: {reservation.ticketPrice || 0} ₽
                          </Typography>
                          <Typography variant="body2">
                            Итого: {reservation.total || 0} ₽
                          </Typography>
                        </Box>
                        <Box ml={2}>
                          {reservation.QRCode ? (
                            <img 
                              src={reservation.QRCode} 
                              alt="QR Code" 
                              className={classes.qrCode}
                            />
                          ) : (
                            <CircularProgress size={24} />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
          <Box mt={3}>
            <TablePagination
              backIconButtonProps={{
                'aria-label': 'Предыдущая страница'
              }}
              component="div"
              count={reservations.length}
              nextIconButtonProps={{
                'aria-label': 'Следующая страница'
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Карточек на странице:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            />
          </Box>
        </PortletContent>
      </Portlet>
    );
  }
}

export default withStyles(styles)(ReservationsTable);
/*
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TablePagination,
  Box,
  CircularProgress,
  Button // Добавлен импорт Button
} from '@material-ui/core';
import { Portlet, PortletContent } from '../../../../../components';
import { connect } from 'react-redux'; // Добавлен импорт connect
import styles from './styles';
// import { removeReservation } from '../../../../../store/actions/reservations';

class ReservationsTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    reservations: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired
  };

  static defaultProps = {
    reservations: [],
    movies: [],
    cinemas: []
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  onFindAttr = (id, list, attr) => {
    if (!id || !list || !list.length) return 'Не найдено';
    const item = list.find(item => item._id === id);
    return item ? item[attr] : 'Не найдено';
  };

//   handleCancelReservation = async (reservationId) => {
//   const token = localStorage.getItem('jwtToken');
//   if (!token) {
//     this.props.history.push('/login');
//     return;
//   }

//   const isConfirmed = window.confirm('Вы уверены?');
//   if (!isConfirmed) return;

//   try {
//     await this.props.removeReservation(reservationId);
//   } catch (error) {
//     console.error('Ошибка:', error);
//   }
//  };

  render() {
    const { classes, reservations, movies, cinemas } = this.props;
    const { rowsPerPage, page } = this.state;

    if (!reservations || !reservations.length) {
      return (
        <Portlet>
          <PortletContent>
            <Typography variant="body1">У вас нет активных бронирований</Typography>
          </PortletContent>
        </Portlet>
      );
    }

    return (
      <Portlet>
        <PortletContent>
          <Grid container spacing={3}>
            {reservations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(reservation => (
                <Grid item xs={12} sm={6} md={4} key={reservation._id || Math.random()}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom>
                            {this.onFindAttr(reservation.movieId, movies, 'title')}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            {this.onFindAttr(reservation.cinemaId, cinemas, 'name')}
                          </Typography>
                          <Typography variant="body2">
                            Дата: {reservation.date ? new Date(reservation.date).toLocaleDateString() : 'Не указана'}
                          </Typography>
                          <Typography variant="body2">
                            Время: {reservation.startAt || 'Не указано'}
                          </Typography>
                          <Typography variant="body2">
                            Цена: {reservation.ticketPrice || 0} ₽
                          </Typography>
                          <Typography variant="body2">
                            Итого: {reservation.total || 0} ₽
                          </Typography>
                        </Box>
                        <Box ml={2}>
                          {reservation.QRCode ? (
                            <img 
                              src={reservation.QRCode} 
                              alt="QR Code" 
                              className={classes.qrCode}
                            />
                          ) : (
                            <CircularProgress size={24} />
                          )}
                        </Box>
                      </Box>
                      {/* <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button 
                          variant="contained" 
                          color="secondary"
                          onClick={() => this.handleCancelReservation(reservation._id)}
                          className={classes.cancelButton}
                        >
                          Отменить бронь
                        </Button>
                      </Box> 
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
          <Box mt={3}>
            <TablePagination
              backIconButtonProps={{
                'aria-label': 'Предыдущая страница'
              }}
              component="div"
              count={reservations.length}
              nextIconButtonProps={{
                'aria-label': 'Следующая страница'
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Карточек на странице:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            />
          </Box>
        </PortletContent>
      </Portlet>
    );
  }
}




export default withStyles(styles)(ReservationsTable);
// */