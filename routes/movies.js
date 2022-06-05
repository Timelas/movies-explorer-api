const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const { isValidUrl } = require('../utils/validation');
const {
  getMovies,
  deleteMovieById,
  createMovies,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), deleteMovieById);
moviesRouter.post('/', createMovies);
// celebrate({
//   body: Joi.object().keys({
//     country: Joi.string().required(),
//     director: Joi.string().required(),
//     duration: Joi.number().required(),
//     year: Joi.string().required(),
//     description: Joi.string().required(),
//     image: Joi.string().custom(isValidUrl),
//     trailer: Joi.string().custom(isValidUrl),
//     thumbnail: Joi.string().custom(isValidUrl),
//     movieId: Joi.number().required(),
//     nameRU: Joi.string().required(),
//     nameEN: Joi.string().required(),
//   }),
// }),

module.exports = moviesRouter;
