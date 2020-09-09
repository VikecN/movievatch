const ROLE = require('../models/ROLE');
const User = require('../models/User');

function isAuth(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }else {
        res.redirect('/users/login');
    }
} 

function isAdmin(req, res, next) {
    if(req.user.accountData.accountType === ROLE.ADMIN) {
        return next();
    }else {
        res.redirect('users/protected');
    }
}

function isNotAuth(req, res, next) {    
    if(!req.user) {
        return next();
    }else {
        res.redirect('/');
    }
}

module.exports = {isAuth, isAdmin, isNotAuth}