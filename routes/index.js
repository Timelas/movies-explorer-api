const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');

const usersRouter = require('./users');
const moviesRouter = require('./movies');

const { createUsers, login } = require('../controllers/users');

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUsers);

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

routes.use(auth);

routes.use('/users', usersRouter);
routes.use('/movies', moviesRouter);

module.exports = routes;
