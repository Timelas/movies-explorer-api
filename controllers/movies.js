const Movie = require('../models/movie');

const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const NoAccess = require('../errors/no-access');
const Conflict = require('../errors/conflict');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const createMovies = (req, res, next) => {
  console.log(req.body);
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    owner,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      console.log(req.body);
      if (err.code === 11000) {
        next(new Conflict(`${err.message}`));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((card) => {
      if (!card) {
        throw new NotFound('Фильм не найден');
      } else if (card.owner.toString() !== req.user._id) {
        throw new NoAccess('Вы не можете удалить фильм другого пользователя');
      } else {
        Movie.findByIdAndDelete(req.params._id)
          .then((cardById) => res.send(cardById))
          .catch(next);
      }
    })
    .catch((err) => { next(err); });
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovieById,
};
