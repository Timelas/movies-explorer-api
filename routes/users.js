const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser,
  getUser,
  getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/', getUser);
usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = usersRouter;
