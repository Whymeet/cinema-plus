const jwt = require('jsonwebtoken');
const User = require('../models/user');

const simple = async (req, res, next) => {
  try {
    console.log('Auth middleware: checking authorization header');
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).send({ 
        error: 'Токен авторизации отсутствует' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted from header');

    const decoded = jwt.verify(token, 'mySecret');
    console.log('Token decoded successfully:', { userId: decoded._id });

    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      console.log('User not found or token not in user tokens');
      throw new Error('Пользователь не найден или сессия истекла');
    }

    console.log('User found:', { userId: user._id, tokensCount: user.tokens.length });
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.error('Auth middleware error:', e.message);
    res.status(401).send({ 
      error: e.message || 'Пожалуйста, авторизуйтесь' 
    });
  }
};

const enhance = async (req, res, next) => {
  try {
    console.log('Enhanced auth middleware: checking authorization');
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).send({ 
        error: 'Токен авторизации отсутствует' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted from header');

    const decoded = jwt.verify(token, 'mySecret');
    console.log('Token decoded successfully:', { userId: decoded._id });

    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      console.log('User not found or token not in user tokens');
      throw new Error('Пользователь не найден или сессия истекла');
    }

    console.log('User found:', { userId: user._id, tokensCount: user.tokens.length });
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.error('Enhanced auth middleware error:', e.message);
    res.status(401).send({ 
      error: e.message || 'Пожалуйста, авторизуйтесь' 
    });
  }
};

module.exports = { simple, enhance };
