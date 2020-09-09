const express = require('express');
const route = express.Router();
const axios = require('axios');

route.get('/', (req, res) => {
  res.render('search', { user: req.user, movies: [] });
});

route.post('/', (req, res) => {
  const { movie, type } = req.body;
  const searchedMoviesList = [];

  if(movie === '') {
    res.redirect('/search')
  }

  axios
    .get(
      'http://www.omdbapi.com/?s=' +
        movie.trim() +
        '&type=' +
        type +
        '&apikey=' +
        process.env.API_KEY
    )
    .then((searchedMovies) => {
      if (searchedMovies.data.Response === 'False') {
        res.json({ message: searchedMovies.data.Error });
      } else {
        searchedMovies.data.Search.forEach((movie) => {

          if (movie.Poster != 'N/A' && (movie.Type === 'movie' || movie.Type === 'series') && movie.Year.slice(0,4) > 1980) {

            if (movie.Title.length > 24) {
              movie.Title = movie.Title.slice(0, 22) + '...';
            }

            searchedMoviesList.push({
              imdbID: movie.imdbID,
              Title: movie.Title,
              Year: movie.Year,
              Type: movie.Type,
              Poster: movie.Poster,
            });
          }
        });

        res.render('search', {
          user: req.user,
          movies: searchedMoviesList,
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = route;
