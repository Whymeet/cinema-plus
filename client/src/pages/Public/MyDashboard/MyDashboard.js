import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Account from '../../Admin/Account';
import { getReservations, getMovies, getCinemas } from '../../../store/actions';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(4)
  }
}));

function MyDashboard({ getReservations, getMovies, getCinemas }) {
  const classes = useStyles();

  useEffect(() => {
    getMovies();
    getReservations();
    getCinemas();
  }, [getMovies, getReservations, getCinemas]);

  return (
    <div className={classes.root}>
      <Account />
    </div>
  );
}

const mapDispatchToProps = { getMovies, getReservations, getCinemas };

export default connect(null, mapDispatchToProps)(MyDashboard);
