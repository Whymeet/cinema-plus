const express = require('express');
const upload = require('../utils/multer');
const User = require('../models/user');
const auth = require('../middlewares/auth');

const router = new express.Router();

// Create a user
router.post('/users', async (req, res) => {
  try {
    const {role} = req.body;
    if (role) throw new Error('you cannot set role property.');
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/photo/:id', upload('users').single('file'), async (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const { file } = req;
  const userId = req.params.id;
  try {
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(404);
    user.imageurl = `${url}/${file.path}`;
    await user.save();
    res.send({ user, file });
  } catch (e) {
    console.log(e);
    res.sendStatus(400).send(e);
  }
});

// Login User
router.post('/users/login', async (req, res) => {
  try {
    console.log('Login attempt:', {
      username: req.body.username,
      passwordLength: req.body.password ? req.body.password.length : 0
    });

    const { username, password } = req.body;
    
    // Проверяем наличие данных
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).send({
        error: { message: 'Введите имя пользователя и пароль' }
      });
    }
    
    // Проверяем длину имени пользователя
    if (username.length < 3) {
      console.log('Username too short:', username.length);
      return res.status(400).send({
        error: { message: 'Имя пользователя должно содержать минимум 3 символа' }
      });
    }
    
    if (username.length > 10) {
      console.log('Username too long:', username.length);
      return res.status(400).send({
        error: { message: 'Имя пользователя не должно превышать 10 символов' }
      });
    }
    
    // Проверяем длину пароля
    if (password.length < 5) {
      console.log('Password too short:', password.length);
      return res.status(400).send({
        error: { message: 'Пароль должен содержать минимум 5 символов' }
      });
    }
    
    if (password.length > 15) {
      console.log('Password too long:', password.length);
      return res.status(400).send({
        error: { message: 'Пароль не должен превышать 15 символов' }
      });
    }

    console.log('Attempting to find user:', username);
    const user = await User.findByCredentials(username, password);
    
    if (!user) {
      console.log('User not found');
      return res.status(400).send({
        error: { message: 'Пользователь не найден' }
      });
    }

    console.log('User found, generating token');
    const token = await user.generateAuthToken();
    console.log('Login successful');
    res.send({ user, token });
  } catch (e) {
    console.error('Login error:', e);
    res.status(400).send({
      error: { message: 'Неверное имя пользователя или пароль' }
    });
  }
});

router.post('/users/login/facebook', async (req, res) => {
  const { email, userID, name } = req.body;
  const nameArray = name.split(' ');

  const user = await User.findOne({ facebook: userID });
  if (!user) {
    const newUser = new User({
      name,
      username: nameArray.join('') + userID,
      email,
      facebook: userID,
    });
    try {
      await newUser.save();
      const token = await newUser.generateAuthToken();
      res.status(201).send({ user: newUser, token });
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    const token = await user.generateAuthToken();
    res.send({ user, token });
  }
});

router.post('/users/login/google', async (req, res) => {
  const { email, googleId, name } = req.body;
  const nameArray = name.split(' ');

  const user = await User.findOne({ google: googleId });
  if (!user) {
    const newUser = new User({
      name,
      username: nameArray.join('') + googleId,
      email,
      google: googleId,
    });
    try {
      await newUser.save();
      const token = await newUser.generateAuthToken();
      res.status(201).send({ user: newUser, token });
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    const token = await user.generateAuthToken();
    res.send({ user, token });
  }
});

// Logout user
router.post('/users/logout', auth.simple, async (req, res) => {
  try {
    console.log('Logout attempt for user:', {
      userId: req.user._id,
      tokensCount: req.user.tokens.length
    });

    console.log('Current token:', req.token);
    
    // Находим и удаляем текущий токен
    const tokenIndex = req.user.tokens.findIndex(
      token => token.token === req.token
    );
    
    if (tokenIndex === -1) {
      console.log('Token not found in user tokens');
      return res.status(400).send({ 
        error: 'Токен не найден' 
      });
    }

    // Удаляем только текущий токен
    req.user.tokens.splice(tokenIndex, 1);
    console.log('Token removed, remaining tokens:', req.user.tokens.length);

    await req.user.save();
    console.log('User saved successfully');
    
    res.send({ message: 'Вы успешно вышли из системы' });
  } catch (e) {
    console.error('Logout error:', e);
    res.status(400).send({ 
      error: 'Ошибка при выходе из системы',
      details: e.message 
    });
  }
});

// Logout all
router.post('/users/logoutAll', auth.enhance, async (req, res) => {
  try {
    console.log('Logging out all sessions for user:', req.user._id);
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: 'Все сессии завершены' });
  } catch (e) {
    console.error('LogoutAll error:', e);
    res.status(400).send({ 
      error: 'Ошибка при завершении всех сессий',
      details: e.message 
    });
  }
});

// Get all users
router.get('/users', auth.enhance, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'Only the god can see all the users!',
    });
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

// User infos
router.get('/users/me', auth.simple, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get user by id only for admin
router.get('/users/:id', auth.enhance, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'Only the god can see the user!',
    });
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) return res.sendStatus(404);
    res.send(user);
  } catch (e) {
    res.sendStatus(400);
  }
});

// Edit/Update user
router.patch('/users/me', auth.simple, async (req, res) => {
  console.log('Updating user profile:', req.body);
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'phone', 'username', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    console.log('Invalid updates detected:', updates);
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const { user } = req;
    console.log('Current user data:', {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    });

    updates.forEach((update) => {
      console.log(`Updating ${update}:`, req.body[update]);
      user[update] = req.body[update];
    });
    
    console.log('Attempting to save user with new data:', {
      name: user.name,
      email: user.email,
      phone: user.phone
    });

    await user.save();
    console.log('User updated successfully');
    res.send(user);
  } catch (e) {
    console.error('Error updating user:', {
      name: e.name,
      message: e.message,
      errors: e.errors,
      code: e.code
    });
    
    // Проверяем, является ли ошибка дубликатом уникального поля
    if (e.code === 11000) {
      return res.status(400).send({
        error: 'Этот номер телефона уже используется другим пользователем'
      });
    }
    
    // Отправляем подробную информацию об ошибке
    res.status(400).send({
      error: e.message || 'Ошибка при обновлении профиля',
      details: e.errors
    });
  }
});

// Admin can update user by id
router.patch('/users/:id', auth.enhance, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'Only the god can update the user!',
    });
  const _id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'phone', 'username', 'email', 'password', 'role'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const user = await User.findById(_id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    if (!user) return res.sendStatus(404);
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete by id
router.delete('/users/:id', auth.enhance, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'Only the god can delete the user!',
    });
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) return res.sendStatus(404);

    res.send({ message: 'User Deleted' });
  } catch (e) {
    res.sendStatus(400);
  }
});

router.delete('/users/me', auth.simple, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'You cannot delete yourself!',
    });
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
