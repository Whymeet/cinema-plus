import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { Grid, CircularProgress } from '@material-ui/core';
import { AccountProfile, AccountDetails } from './components';
import { MyReservationTable } from '../../../pages/Public/MyDashboard/components';
import { uploadImage } from '../../../store/actions';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  }
});

class Account extends Component {
  state = {
    showReservations: false
  };

  handleToggleView = () => {
    this.setState(prevState => ({
      showReservations: !prevState.showReservations
    }));
  };

  render() {
    const { classes, uploadImage, user, reservations, movies, cinemas } = this.props;
    const { showReservations } = this.state;

    if (!user) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={4} md={6} xl={4} xs={12}>
            <AccountProfile 
              onToggleView={this.handleToggleView} 
              showReservations={showReservations} 
              uploadImage={uploadImage}
              user={user}
            />
          </Grid>
          <Grid item lg={8} md={6} xl={8} xs={12}>
            {showReservations ? (
              <MyReservationTable
                reservations={reservations}
                movies={movies}
                cinemas={cinemas}
              />
            ) : (
              <AccountDetails user={user} />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

Account.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object,
  reservations: PropTypes.array,
  movies: PropTypes.array,
  cinemas: PropTypes.array
};

const mapStateToProps = ({ movieState, reservationState, cinemaState, authState }) => ({
  movies: movieState.movies,
  reservations: reservationState.reservations.filter(
    reservation => reservation.username === (authState.user ? authState.user.username : '')
  ),
  cinemas: cinemaState.cinemas,
  user: authState.user
});

const mapDispatchToProps = { uploadImage };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Account));
