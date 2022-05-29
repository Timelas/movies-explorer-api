const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const NotAuth = require('../errors/not-auth');
const Conflict = require('../errors/conflict');

const createUsers = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные!'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch((err) => {
      throw new NotAuth(err.message);
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'cookies deleted' });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.status(200).send({
          name: user.name,
          email: user.email,
        });
      }
      return next(new NotFound('Такого пользователя не существует'));
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  createUsers,
  updateUser,
  login,
  getUser,
  logout,
  getCurrentUser,
};
