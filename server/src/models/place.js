const mongoose = require('mongoose');

const { Schema } = mongoose;

const placeSchema = new Schema({
  cinemaId: {
    type: Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  row: {
    type: Number,
    required: true
  },
  seat: {
    type: Number,
    required: true
  },
  priceCoefficient: {
    type: Number,
    required: true,
    default: 1.0
  }
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place; 