const express = require('express');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const userModeling = require('../utils/userModeling');
const generateQR = require('../utils/generateQRCode');

const router = new express.Router();

// Create a reservation
router.post('/reservations', auth.simple, async (req, res) => {
  const reservation = new Reservation(req.body);
  const QRCode = await generateQR(`${process.env.CLIENT_URL || 'http://localhost:3000'}/checkin/${reservation._id}`);

  try {
    reservation.QRCode = QRCode;
    await reservation.save();
    
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('movieId', 'title')
      .populate('cinemaId', 'name');
      
    res.status(201).send(populatedReservation);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all reservations
router.get('/reservations', auth.simple, async (req, res) => {
  try {
    const reservations = await Reservation.find({})
      .populate('movieId', 'title')
      .populate('cinemaId', 'name');
    res.send(reservations);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get reservation by id
router.get('/reservations/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id)
      .populate('movieId', 'title')
      .populate('cinemaId', 'name');
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Get reservation checkin by id
router.get('/reservations/checkin/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id)
      .populate('movieId', 'title')
      .populate('cinemaId', 'name');
    
    if (!reservation) {
      return res.status(404).send({ message: 'Билет не найден' });
    }

    reservation.checkin = true;
    await reservation.save();
    
    res.send(reservation);
  } catch (e) {
    res.status(400).send({ message: 'Ошибка при проверке билета' });
  }
});

// Update reservation by id
router.patch('/reservations/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'date',
    'startAt',
    'seats',
    'ticketPrice',
    'total',
    'username',
    'phone',
    'checkin',
    'QRCode'
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const reservation = await Reservation.findById(_id);
    updates.forEach((update) => (reservation[update] = req.body[update]));
    await reservation.save();
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Delete reservation by id
router.delete('/reservations/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findByIdAndDelete(_id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.sendStatus(400);
  }
});

// User modeling get suggested seats
router.get('/reservations/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const suggestedSeats = await userModeling.reservationSeatsUserModeling(username);
    res.send(suggestedSeats);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
/*
const express = require('express');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const userModeling = require('../utils/userModeling');
const generateQR = require('../utils/generateQRCode');

const router = new express.Router();

// Create a reservation
// Get reservation checkin by id
// Get reservation checkin by id
router.get('/reservations/checkin/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id)
      .populate('movieId', 'title')
      .populate('cinemaId', 'name');
    
    if (!reservation) {
      return res.status(404).send({ message: 'Билет не найден' });
    }

    reservation.checkin = true;
    await reservation.save();
    
    res.send(reservation);
  } catch (e) {
    res.status(400).send({ message: 'Ошибка при проверке билета' });
  }
});

// router.post('/reservations', auth.simple, async (req, res) => {
//   const reservation = new Reservation(req.body);

//   const QRCode = await generateQR(`https://elcinema.herokuapp.com/#/checkin/${reservation._id}`);

//   try {
//     await reservation.save();
//     res.status(201).send({ reservation, QRCode });
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });


// Get all reservations
router.get('/reservations', auth.simple, async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.send(reservations);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get reservation by id
router.get('/reservations/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Get reservation checkin by id
router.get('/reservations/checkin/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id);
    reservation.checkin = true;
    await reservation.save();
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update reservation by id
router.patch('/reservations/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'date',
    'startAt',
    'seats',
    'ticketPrice',
    'total',
    'username',
    'phone',
    'checkin',
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const reservation = await Reservation.findById(_id);
    updates.forEach((update) => (reservation[update] = req.body[update]));
    await reservation.save();
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Delete reservation by id
router.delete('/reservations/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findByIdAndDelete(_id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.sendStatus(400);
  }
});

// User modeling get suggested seats
router.get('/reservations/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const suggestedSeats = await userModeling.reservationSeatsUserModeling(username);
    res.send(suggestedSeats);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
//*/