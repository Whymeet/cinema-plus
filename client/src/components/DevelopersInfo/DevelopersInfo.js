import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  content: {
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  title: {
    textAlign: 'center',
  },
  text: {
    marginBottom: theme.spacing(2),
  },
  developers: {
    margin: theme.spacing(3, 0),
  },
  developer: {
    marginBottom: theme.spacing(1),
  },
  year: {
    marginTop: theme.spacing(3),
  }
}));

const DevelopersInfo = ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle className={classes.title}>Сведения о разработчиках</DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant="h6" className={classes.text}>
          Самарский университет. Институт информатики и кибернетики
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Курсовой проект по дисциплине «Программная инженерия»
        </Typography>
        <Typography variant="body1" className={classes.text}>
          по теме «Автоматизированная система бронирования билетов в кинотеатре»
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Разработчики обучающиеся группы 6303-020302D:
        </Typography>
        <div className={classes.developers}>
          <Typography variant="body1" className={classes.developer}>
            Орлова Т.Д.
          </Typography>
          <Typography variant="body1" className={classes.developer}>
            Скоробогатова Н.А.
          </Typography>
          <Typography variant="body1" className={classes.developer}>
            Туркин М.Ю.
          </Typography>
          <Typography variant="body1" className={classes.developer}>
            Чубарь А.В.
          </Typography>
        </div>
        <Typography variant="body1" className={classes.year}>
          Самара 2025
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DevelopersInfo; 