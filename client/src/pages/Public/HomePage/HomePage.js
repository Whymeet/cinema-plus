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
import ohas1   from '../../../assets/images/ohas1.png';
import ohas2  from '../../../assets/images/ohas2.png';
import ohas3   from '../../../assets/images/ohas3.png';
import ohas4  from '../../../assets/images/ohas4.png';
import ohas5  from '../../../assets/images/ohas5.png';
import ohas6  from '../../../assets/images/ohas6.png';
import ohas7  from '../../../assets/images/ohas7.png';

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
                Системные требования включают в себя тип операционной системы-  Windows 10 и выше, браузер – Google Chrome, Mozilla Firefox или Internet Explorer 9 и выше.
                Погрузитесь в мир кино с максимальным удобством, не выходя из дома!
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
            </Grid>
            <Grid item xs={12} md={6}>
              <img src={bilder1} alt="Кинотеатр" className={classes.image} />
            </Grid>
            <Grid item xs={12} md={3}>
            </Grid>
             

             <Grid item xs={12} md={1}>
            </Grid>
             <Grid item xs={12} md={5}>
              <img src={ohas1} alt="Афиша" className={classes.image} />
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="body1" className={classes.infoText}>
                &#8226; Главная страница и навигация
                <br></br>
                На нашем сайте вы найдете всё необходимое для идеального кинопутешествия. 
                В верхней части страницы расположено навигационное меню, 
                в нижней - гиперссылка, нажав на которую пользователь увидит всплывающее окно с информацией о разработчиках
                Главная страница просмотров доступных фильмов - Афиша, предоставляет вам возможность фильтрации фильмов по жанру, 
                названию или стране производства. 
              </Typography>
            </Grid>
             <Grid item xs={12} md={1}>
            </Grid> 

  
             <Grid item xs={12} md={1}>
            </Grid> 
             <Grid item xs={12} md={5}>
              <Typography variant="body1" className={classes.infoText}>
                У каждого фильма на странице афиши отображается изображение постера, название, режиссёр, страна, длительность в минутах, 
                жанр и описание. Нажав на фильм, можно посмотреть страницу с подробным описанием этого фильма.
              </Typography>
            </Grid>
              <Grid item xs={12} md={5}>
              <img src={ohas2} alt="Карточка фильма" className={classes.image} />
            </Grid>
           <Grid item xs={12} md={1}>
            </Grid>    



            

           <Grid item xs={12} md={4}>
              <img src={ohas3} alt="Авторизация" className={classes.image} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1" className={classes.alText}>
                <br></br>
                <br></br>
                <br></br>
                 &#8226; Авторизацтя и регистрация
                <br></br>
                Пользователь может пройти авторизацию, введя свои учётные данные:
                имя пользователя,пароль, и нажать на кнопку «Войти».
                Если пользователь ещё не был зарегистрирован, на странице предусмотрена
                гиперссылка «Зарегистрироваться», нажав на которую, 
                 будет открываться страница регистрации
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <img src={ohas4} alt="Регистрация" className={classes.image} />
            </Grid>
            

           
             <Grid item xs={12} md={1}>
            </Grid>    
            <Grid item xs={12} md={4}>
              <Typography variant="body1" className={classes.infoText}>
                &#8226; Бронирование билетов
                <br></br>
                Пользователь может забронировать место в кино. Для этого нужно нажать на кнопку «Купить билет», после чего
                откроется страница бронирования с выбором зала,
                даты и времени сеанса.Также доступна интерактивная схема зала,
                где отображаются доступные места с анимацией. Пользователь может выбратьт места, кликая по ним.
                У каждого места можно увидеть информацию о нем: цена, статус – доступно, занято или выбрано.
                После выбора мест, нужно нажать на кнопку «Оформить» (доступно только авторизованным пользователям). 
                После успешного добавления отображается сообщение и появляется кнопка «Скачать билет». 
                Также можно отправить билет на электронную почту.
              </Typography>
            </Grid>
             <Grid item xs={12} md={6}>
              <img src={ohas5} alt="Бронирование" className={classes.image} />
            </Grid>
            <Grid item xs={12} md={1}>
            </Grid>    




            <Grid item xs={12} md={4}>
              <img src={ohas6} alt="Данные пользователя" className={classes.image} />
               <Typography variant="body1" className={classes.alText}>
                 В первом разделе представлена подробная информация о пользователе, которую можно изменить: полное имя, почта, номер телефона и пароль. 
                При изменении данных нужно нажать кнопку «Сохранить». Завершить сеанс и выйти из аккаунта можно с помощью кнопки «Выйти» в правом верхнем углу.
              </Typography>

            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1" className={classes.alText}>
                <br></br>
                <br></br>
                 &#8226; Управление личным кабинетом
                <br></br>
                <br></br>
                При нажатии на иконку личного кабинета (в правом верхнем углу) можно перейти на страницу личного кабинета.
                С помощью кликабельного изображения билетов можно увидеть два раздела: «Личная информация» и «Мои бронирования» .
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <img src={ohas7} alt="Данные бронирований" className={classes.image} />
               <Typography variant="body1" className={classes.alText}>
                Во втором разделе можно увидеть купленные билеты и подробную информацию о них: название фильма, дата покупки, зал, места 
                и QR-код для входа. Для каждого билета предоставляется возможность отменить бронирование с помощью кнопки «ОТМЕНИТЬ БРОНИРОВАНИЕ».
               </Typography>
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
