const mongoose = require('mongoose');

const { Schema } = mongoose;
const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  language: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  director: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  country: { 
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  cast: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  duration: {
    type: Number,
    required: true,
    min: [30, 'Длительность фильма должна быть не менее 30 минут'],
    max: [300, 'Длительность фильма не должна превышать 300 минут'],
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
