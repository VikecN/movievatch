const express = require('express');
const route = express.Router();
const axios = require('axios');

const User = require('../../models/User');
const Movie = require('../../models/Movie');
const objectFormating = require('../../config/MovieObjectFormating');

var movieObj = {};

route.get('/id/:id', (req, res) => {
  const { id } = req.params;

  User.findOne({ _id: req.user._id, 'movies.imdbID': id }, (err, movies) => {
    if (err) throw err;

    if (movies != undefined && movies.length != 0) {
      movies.movies.forEach((movie) => {
        if (movie.imdbID === id) {
          movieObj = new Movie(
            movie.imdbID,
            movie.Title,
            movie.Genre,
            movie.Plot,
            movie.Writer,
            movie.Rated,
            movie.Director,
            movie.Actors,
            movie.Production,
            movie.Year,
            movie.Released,
            movie.Runtime,
            movie.Type,
            movie.Poster,
            movie.Ratings,
            movie.WatchedStatus
          );

          movieObj.Watched = movie.Watched;
        }
      });
      console.log('Watched');
      res.status(200);
      res.render('movie', { user: req.user, movie: movieObj });
    } else {
      axios
        .get('http://www.omdbapi.com/?i=' + id + '&plot=full&apikey=' + process.env.API_KEY)
        .then((movie) => {
          if (movie.data.Response === 'False') {
            res.json({ message: movie.data.Error });
          } else {
            movieObj = new Movie(
              movie.data.imdbID,
              movie.data.Title,
              (movie.data.Genre = objectFormating.gerneSplit(movie.data.Genre)),
              movie.data.Plot,
              movie.data.Writer,
              movie.data.Rated,
              movie.data.Director,
              (movie.data.Actors = objectFormating.actorSplit(movie.data.Actors)),
              movie.data.Production,
              (movie.data.Year = objectFormating.yearStringToDate(movie.data.Year)),
              (movie.data.Released = objectFormating.releasedStringToDate(movie.data.Released)),
              (movie.data.Runtime = objectFormating.runtimeToNumber(movie.data.Runtime)),
              movie.data.Type,
              movie.data.Poster,
              movie.data.Ratings,
              (WatchedStatus = false)
            );
            res.status(movie.status);
            res.render('movie', { user: req.user, movie: movieObj });
          }
        })
        .catch((error) => {
          console.error('Error >>>>> ' + error);

          res.status(500);
          res.json({ message: 'Server Error' });
        });
    }
  });
});

route.post('/save', (req, res) => {
  if (movieObj != null) {
    movieObj.WatchedOn = objectFormating.watchedOnDate();
    movieObj.WatchedStatus = true;

    User.updateOne({ _id: req.user._id }, { $push: { movies: movieObj } }, (err, result) => {
      if (err) throw err;

      if (result.ok === 1) {
        req.flash('success_msg', 'Movie saved');
        res.redirect('/movie/id/' + movieObj.imdbID);
      }
    });
  } else {
    req.flash('error_msg', 'Movie is not saved');
    res.redirect('/movie/id/' + movieObj.imdbID);
  }
});

route.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { dateWatched } = req.body;

  //LOGIC
});

route.post('/delete', (req, res) => {
  const { id } = req.body;

  User.updateOne({ _id: req.user._id, movies: { $pull: { imdbID: id } } }, (err, movie) => {
    if (err) throw err;
    if (movie.ok === 1) {
      req.flash('success_msg', 'Movie deleted from watched list');
      res.status(200);
      res.redirect('/movie/id/' + req.body.id);
    }
  });
});

module.exports = route;
