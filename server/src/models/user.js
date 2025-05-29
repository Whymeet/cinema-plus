const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;
const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Имя пользователя должно содержать минимум 3 символа'],
      maxlength: [10, 'Имя пользователя не должно превышать 10 символов'],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('email is invalid');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: [5, 'Пароль должен содержать минимум 5 символов'],
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Пароль не должен содержать слово "password"');
        }
      },
    },
    role: {
      type: String,
      default: 'guest',
      enum: ['guest', 'admin', 'superadmin'],
    },

    facebook: String,
    google: String,

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function(value) {
          console.log('Validating phone number:', value);
          if (!value) {
            console.log('Empty phone number, validation passed');
            return true;
          }
          
          const cleanedNumber = value.replace(/\D/g, '');
          console.log('Cleaned number:', cleanedNumber);
          
          const isValid = cleanedNumber.length === 11 && cleanedNumber.startsWith('7');
          console.log('Phone validation result:', { original: value, cleaned: cleanedNumber, isValid });
          
          return isValid;
        },
        message: props => {
          console.log('Validation failed for phone:', props.value);
          return 'Неверный формат номера телефона. Используйте формат: +7XXXXXXXXXX';
        }
      }
    },
    imageurl: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  if (!userObject.role === 'superadmin') {
    delete userObject.updatedAt;
    delete userObject.__v;
  }
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  try {
    console.log('Generating auth token for user:', this._id);
    const token = jwt.sign({ _id: this._id.toString() }, 'mySecret');
    
    // Проверяем существующие токены
    this.tokens = this.tokens.filter(tokenObj => {
      try {
        jwt.verify(tokenObj.token, 'mySecret');
        return true;
      } catch (e) {
        console.log('Removing expired token');
        return false;
      }
    });
    
    this.tokens = this.tokens.concat({ token });
    console.log('Token added to user, total tokens:', this.tokens.length);
    
    await this.save();
    return token;
  } catch (e) {
    console.error('Error generating auth token:', e);
    throw new Error('Ошибка при создании токена авторизации');
  }
};

userSchema.statics.findByCredentials = async (username, password) => {
  try {
    console.log('Finding user by credentials:', { username });
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log('User not found:', username);
      throw new Error('Неверное имя пользователя или пароль');
    }

    console.log('Comparing passwords');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      throw new Error('Неверное имя пользователя или пароль');
    }

    console.log('User authenticated successfully');
    return user;
  } catch (e) {
    console.error('Error in findByCredentials:', e);
    throw e;
  }
};

// Hash the plain text password before save
userSchema.pre('save', async function(next) {
  const user = this;
  console.log('Pre-save hook triggered');
  
  if (user.isModified('password')) {
    console.log('Password was modified, hashing...');
    user.password = await bcrypt.hash(user.password, 8);
    console.log('Password hashed successfully');
  } else {
    console.log('Password was not modified');
  }
  
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
