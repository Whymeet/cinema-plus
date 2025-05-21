const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Movie = require('../models/movie');
const userModeling = require('../utils/userModeling');

const router = new express.Router();

// Create a movie
router.post('/movies', auth.enhance, async (req, res) => {
  const movie = new Movie(req.body);
  try {
    await movie.save();
    res.status(201).send(movie);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post(
  '/movies/photo/:id',
  auth.enhance,
  upload('movies').single('file'),
  async (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}`;
    const { file } = req;
    const movieId = req.params.id;
    try {
      if (!file) {
        const error = new Error('Пожалуйста, загрузите файл');
        error.httpStatusCode = 400;
        return next(error);
      }
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).send({ error: 'Фильм не найден' });
      }
      movie.image = `${url}/${file.path}`;
      await movie.save();
      res.send({ movie, file });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }
);

// Get all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get movie by id
router.get('/movies/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const movie = await Movie.findById(_id);
    if (!movie) return res.sendStatus(404);
    return res.send(movie);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Update movie by id
router.put('/movies/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  console.log('Получены данные для обновления:', req.body);
  console.log('Поля для обновления:', updates);
  
  const allowedUpdates = [
    'title',
    'image',
    'language',
    'genre',
    'director',
    'cast',
    'description',
    'duration',
    'releaseDate',
    'endDate',
    'country'
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    console.log('Недопустимые поля:', updates.filter(update => !allowedUpdates.includes(update)));
    return res.status(400).send({ error: 'Недопустимые поля для обновления!' });
  }

  try {
    const movie = await Movie.findById(_id);
    if (!movie) {
      console.log('Фильм не найден:', _id);
      return res.status(404).send({ error: 'Фильм не найден' });
    }
    console.log('Текущие данные фильма:', movie);
    updates.forEach((update) => (movie[update] = req.body[update]));
    await movie.save();
    console.log('Обновленные данные фильма:', movie);
    res.send(movie);
  } catch (e) {
    console.error('Ошибка при обновлении фильма:', e);
    res.status(400).send(e);
  }
});

// Delete movie by id
router.delete('/movies/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(_id);
    return !movie ? res.sendStatus(404) : res.send(movie);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Movies User modeling (Get Movies Suggestions)
router.get('/movies/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const cinemasUserModeled = await userModeling.moviesUserModeling(username);
    res.send(cinemasUserModeled);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
