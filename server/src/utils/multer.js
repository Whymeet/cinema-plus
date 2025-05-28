const multer = require('multer');

const storage = path =>
  multer.diskStorage({
    destination: './uploads/' + path,
    filename: (req, file, cb) => {
      // Транслитерация кириллицы и удаление специальных символов
      const fileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
      cb(null, `${Date.now()}-${fileName}`);
    },
  });

const upload = path =>
  multer({
    storage: storage(path),
    limits: {
      fileSize: 50 * 1024 * 1024 // 50 MB в байтах
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Разрешены только форматы .png, .jpg и .jpeg!'));
      }
    },
  });

module.exports = upload;
