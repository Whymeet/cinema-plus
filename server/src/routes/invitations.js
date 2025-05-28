const express = require('express');
const auth = require('../middlewares/auth');
const { sendEmail } = require('../utils/mail');

const router = new express.Router();

const createMailOptions = (data) => {
  const { to, host, movie, date, time, cinema, image, seat } = data;
  
  console.log('Данные для билета:', { to, host, movie, date, time, cinema, seat });

  // Форматируем место, убеждаемся что оно существует
  const formattedSeat = seat || 'Место не указано';

  const htmlContent = `
    <h1><strong>Ваш билет в кино</strong></h1>
    <p>${host}, вот ваш билет:</p>
    <p>Название фильма: ${movie}</p>
    <p>Дата: ${date}</p>
    <p>Время: ${time}</p>
    <p>Кинотеатр: ${cinema}</p>
    <p>Ваше место: <strong>${formattedSeat}</strong></p>
    <img src="${image}" alt="Изображение кинотеатра"/>
    <br/>
  `;
  
  return {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Cinema + Ваш билет',
    html: htmlContent,
  };
};

// Отправка приглашений по email
router.post('/invitations', auth.simple, async (req, res) => {
  try {
    const invitations = req.body;
    const promises = invitations.map((invitation) => {
      const mailOptions = createMailOptions(invitation);
      return sendEmail(mailOptions)
        .then(() => ({
          success: true,
          msg: `Приглашение отправлено на ${mailOptions.to}!`,
        }))
        .catch((error) => ({ 
          success: false, 
          msg: error.message 
        }));
    });

    const results = await Promise.all(promises);
    res.status(201).json(results);
  } catch (error) {
    console.error('Ошибка при отправке приглашений:', error);
    res.status(500).json({ 
      success: false, 
      msg: 'Ошибка при отправке приглашений' 
    });
  }
});

module.exports = router;
