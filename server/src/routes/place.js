const express = require('express');
const auth = require('../middlewares/auth');
const Place = require('../models/place');
const Cinema = require('../models/cinema');

const router = new express.Router();

// Получить все места для кинотеатра
router.get('/places/:cinemaId', async (req, res) => {
  try {
    const places = await Place.find({ cinemaId: req.params.cinemaId });
    res.send(places);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Обновить коэффициенты мест
router.patch('/places/:cinemaId', auth.enhance, async (req, res) => {
  const { coefficients } = req.body;
  const { cinemaId } = req.params;

  try {
    // Удаляем старые коэффициенты
    await Place.deleteMany({ cinemaId });

    // Создаем новые коэффициенты
    const places = coefficients.flatMap((row, rowIndex) =>
      row.map((seat, seatIndex) => ({
        cinemaId,
        row: rowIndex,
        seat: seatIndex,
        priceCoefficient: seat.coefficient
      }))
    );

    await Place.insertMany(places);
    res.send({ message: 'Коэффициенты успешно обновлены' });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router; 