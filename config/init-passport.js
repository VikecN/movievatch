const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
        
        User.findOne({email}, (err, user) => {
            if(err) {return done(err)}
            
            //If not user
            if(!user) {return done(null, false, {error_msg: 'Incorect username'})}

            //if not verified user
            if(!user.accountData.verifiedEmail) {return done(null, false, {error_msg: 'Email not verified'})}
            
            //Compare passwords
            bcrypt.compare(password, user.password, (err, result) => {
                if(err) throw err;

                //if passwords not match
                if(!result) {done(null, false, {error_msg: 'Incorect password'})}

                //if passwords matches
                if(result === true) {done(null, user)}
            });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        //Find user with id
        User.findById(user._id)
            //If user 
            .then(user => done(null, user))
            //If error
            .catch(err => done(err))
    })
}