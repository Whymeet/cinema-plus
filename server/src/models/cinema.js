const mongoose = require('mongoose');

const { Schema } = mongoose;

const cinemaSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  seats: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  seatTypes: {
    type: Map,
    of: Number,
    default: new Map()
  }
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
