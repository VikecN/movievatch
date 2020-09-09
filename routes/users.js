const fs = require('fs');
const express = require('express');
const route = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

//Models
const ROLE = require('../models/ROLE');
const User = require('../models/User');

//Middlewares
const isNotAuth = require('../config/isAuth').isNotAuth;
const sendEmail = require('../misc/mailer').sendEmail;

//NEED TO BE REPLACED WITH REACT -----
route.get('/login', isNotAuth, (req, res) => {
  res.render('login');
});

route.get('/register', isNotAuth, (req, res) => {
  res.render('register');
});
//------------------------------------



//Login POST Route
route.post('/login', isNotAuth,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })
);

//Logout GET Route
route.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Logout');
  res.redirect('/users/login');
});

//Register POST Route
route.post('/register', isNotAuth, async (req, res) => {
  const userData = ({ firstName, lastName, email, password, password2 } = req.body);
  let errors = [];

  //Empty filed
  if (
    userData.firstName === '' ||
    userData.lastName === '' ||
    userData.email === '' ||
    userData.password === '' ||
    userData.password2 === ''
  ) {
    errors.push({ msg: 'Field all places' });
  }

  //Password lenght shorter then 6 characters
  if (userData.password !== undefined && userData.password.length < 6) {
    errors.push({ msg: 'Password need to have at least 6 characters' });
  }

  //Passwords not matching
  if (userData.password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //Is haveing errors
  if (errors.length > 0) {
    res.status(400);
    req.flash('errors', errors);
    res.redirect('/users/register');
  } else {
    try {
      //Founding user with email
      const user = await User.findOne({ email: userData.email });

      //if User found
      if (user) {
        errors.push({ msg: 'Email already exist' });
        req.flash('errors', errors);
        res.redirect('/users/register');
      }

      //Hashing Password
      await bcrypt.genSalt(10, async (err, passwordSolt) => {
        if (err) throw err;

        await bcrypt.hash(userData.password, passwordSolt, async (err, hashedPassword) => {
          if (err) throw err;

          //Set hashed password
          userData.password = hashedPassword;

          //Secret token generate
          const secretToken = randomstring.generate();

          //Insert new user
          await User.create(
            {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              password: userData.password,
              accountData: {
                accountType: ROLE.BASIC,
                secretToken: secretToken,
                verifiedEmail: false,
              },
            },
            async (err, success) => {
              if(success) {
                
                //From
                const emailFrom = 'moviewatch@moviesite.com';
                
                //Subject
                const subject = 'MovieWatch - Account Verification';
                
                //Compose html
                const html = "<center>" +
                "<h1>Hi There!</h1><br>" +
                "<h3>Verify your email by going to this link:</h3><br>" +
                "<a href='http://localhost:4000/users/verify/" + success.accountData.secretToken + "'>Verify Account</a> " +
                "</center>";

                //Send Email 
                await sendEmail(emailFrom, userData.email, subject, html)
                .then(console.log('Email sended!')).catch(err => console.error(err));

                req.flash('success_msg', 'Please cheack your email');
                res.redirect('/users/login');
              }
            }
          );
        });
      });
    } catch (error) {
      console.error(error);
      res.redirect('/users/register');
    }
  }
});

route.get('/verify/:token', isNotAuth, (req, res) => {
  const { token } = req.params;

  const accountDataObj = {
    accountType: ROLE.BASIC,
    secretToken: token.trim(),
    verifiedEmail: false
  }

  User.findOne({accountData: accountDataObj}, async (err, user) => {
    if(err) throw err;
    console.log(user)

    if(!user) {
      req.flash('error_msg', 'Try Again!');
      res.redirect('/users/login');
    }

    if(user) {
      await User.updateOne({accountData: accountDataObj}, {accountData: {accountType: user.accountData.accountType, verifiedEmail: true}}, async (err, updatedUser) => {
        if(err) throw err;
        
        if(!updatedUser) {
          req.flash('error_msg', 'Not found user');
          res.redirect('/users/login');
        }

        req.flash('success_msg', 'You can now login');
        res.redirect('/users/login');
      });
    }
  });
});

module.exports = route;
