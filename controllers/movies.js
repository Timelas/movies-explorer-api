const Movie = require('../models/movie');

const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const NoAccess = require('../errors/no-access');
const Conflict = require('../errors/conflict');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    id,
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
    trailerLink,
    thumbnail,
    movieId: id,
    owner,
    nameRU,
    nameEN,
  })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Вы уже добавили этот фильм'));
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
