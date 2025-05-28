const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Отладочный вывод
console.log('Проверка переменных окружения:');
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('GMAIL_REFRESH_TOKEN exists:', !!process.env.GMAIL_REFRESH_TOKEN);
console.log('GMAIL_USER exists:', !!process.env.GMAIL_USER);
console.log('GMAIL_REDIRECT_URL exists:', !!process.env.GMAIL_REDIRECT_URL);

// Создаем OAuth2 клиент
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
);

// Устанавливаем учетные данные сразу при создании клиента
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const createTransporter = async () => {
  try {
    // Получаем access token
    const accessToken = await oauth2Client.getAccessToken();
    console.log('Access Token получен:', !!accessToken);

    // Создаем транспорт nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    return transporter;
  } catch (error) {
    console.error('Ошибка создания транспорта:', error);
    throw error;
  }
};

const sendEmail = async (mailOptions) => {
  try {
    const transporter = await createTransporter();
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    throw error;
  }
};

module.exports = { sendEmail };
