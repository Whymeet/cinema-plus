import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Box, Grid, Typography, Container } from '@material-ui/core';
import {
  getMovies,
  getShowtimes,
  getMovieSuggestion
} from '../../../store/actions';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import MovieBanner from '../components/MovieBanner/MovieBanner';
import styles from './styles';
import bilder1 from '../../../assets/images/bilder.png';
import bilder2 from '../../../assets/images/bilder2.png';

class HomePage extends Component {
  componentDidMount() {
    const {
      movies,
      showtimes,
      suggested,
      getMovies,
      getShowtimes,
      getMovieSuggestion,
      user
    } = this.props;
    if (!movies.length) getMovies();
    if (!showtimes.length) getShowtimes();
    if (user) {
      if (!suggested.length) getMovieSuggestion(user.username);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.props.user &&
        this.props.getMovieSuggestion(this.props.user.username);
    }
  }

  render() {
    const {
      classes,
      randomMovie,
      comingSoon,
      nowShowing,
      suggested
    } = this.props;

    return (
      <Fragment>
        {/* <MovieBanner movie={randomMovie} height="85vh" /> */}
        <Box height={60} />
        <Container maxWidth="xl">
          <Grid container spacing={6} className={classes.infoSection}>
            <Grid item xs={12}>
              <Typography variant="h4" className={classes.welcomeTitle}>
                Добро пожаловать на сайт кинотеатра «Фокус» в Самаре!
              </Typography>
              <Typography variant="body1" className={classes.welcomeText}>
                Мы создали для вас удобную и современную платформу, которая делает поход в кино настоящим удовольствием. 
                Наш кинотеатр «Фокус» заботится о вашем комфорте: вы можете легко ознакомиться с актуальной афишей, 
                узнать о фильмах в прокате или тех, что скоро выйдут на экраны, и приобрести билеты онлайн, не тратя время на очереди. 
                Погрузитесь в мир кино с максимальным удобством, не выходя из дома!
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <img src={bilder1} alt="Кинотеатр" className={classes.image} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" className={classes.infoText}>
                На нашем сайте вы найдете всё необходимое для идеального кинопутешествия. 
                Главная страница просмотров доступных фильмов - Афиша, предоставляет вам возможность фильтрации фильмов по жанру, 
                названию или стране производства. Вы можете выбрать сеанс на удобный вам день и время, 
                воспользовавшись календарем. Карточки фильмов содержат всю важную информацию: название, жанр, 
                страну, продолжительность, тип кинозала, а также расписание 
                сеансов с указанием времени и стоимости билетов. Разные тарифы позволят выбрать оптимальный вариант для вашего визита.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" className={classes.infoText}>
                Навигация по сайту  интуитивно понятна: одним кликом вы попадете в нужный раздел. А для тех, кто хочет управлять 
                своими бронированиями, в правом верхнем углу предусмотрена кнопка для входа в личный кабинет или регистрации.
                В нижней части сайта расположен информационный блок с контактными данными кинотеатра, а также 
                ссылкой на информационный блок сведений о разработчиках данного сайта.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <img src={bilder2} alt="Кинозал" className={classes.image} />
            </Grid>
          </Grid>
        </Container>
        <Box height={60} />
        <MovieCarousel
          carouselClass={classes.carousel}
          title="Рекомендовано для вас"
          movies={suggested}
        />
        <MovieCarousel
          carouselClass={classes.carousel}
          title="Смотрите сейчас"
          to="/movie/category/nowShowing"
          movies={nowShowing}
        />
        <MovieCarousel
          carouselClass={classes.carousel}
          title="Скоро в прокате"
          to="/movie/category/comingSoon"
          movies={comingSoon}
        />
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  movies: PropTypes.array.isRequired,
  latestMovies: PropTypes.array.isRequired
};

const mapStateToProps = ({ movieState, showtimeState, authState }) => ({
  movies: movieState.movies,
  randomMovie: movieState.randomMovie,
  latestMovies: movieState.latestMovies,
  comingSoon: movieState.comingSoon,
  nowShowing: movieState.nowShowing,
  showtimes: showtimeState.showtimes,
  suggested: movieState.suggested,
  user: authState.user
});

const mapDispatchToProps = { getMovies, getShowtimes, getMovieSuggestion };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(HomePage));
