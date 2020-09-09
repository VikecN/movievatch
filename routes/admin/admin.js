const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
    res.send('<h3>Admin -> ' + req.user.FirstName + '</h3><br /> <h4><a href="/users/logout">Logout</a></h4><br /><a href="/protected">Only Admins can go here</a>');
});

route.post('/admin', (req, res) => {
    
});

module.exports = route