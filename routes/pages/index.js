const express = require('express');
const route = express.Router();
const moment = require('moment');

const User = require('../../models/User');

route.get('/', (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) throw err

        if(user) {
            console.log(user.movies)
            res.render('home', {user: req.user, movies: user.movies});
        }

    });  
});

route.use('/movie', require('./movie'));
route.use('/search', require('../pages/search'));

module.exports = route