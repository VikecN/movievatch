require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const flash = require('express-flash');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const ejs = require('ejs');
const isAuth = require('./config/isAuth').isAuth;
const isAdmin = require('./config/isAuth').isAdmin;

require('./config/init-passport')(passport);

//DATABASE
const connection = require('./config/MongoURI').MongoURI;
mongoose
  .connect(connection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(console.log('Connected to MongoDB'))
  .catch((err) => {
    console.log('Error >>>>' + err);
  });

const app = express();

//MIDDELWEARS
app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:4000',
    credentials: true,
  })
);
app.use(expressLayouts);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.errors = req.flash('errors');
  return next();
});

//ROUTES
app.use('/users', require('./routes/users'));
app.use('/', isAuth, require('./routes/pages/index'));
app.use('/admin', isAuth, isAdmin, require('./routes/admin/admin'));

//SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Server started on PORT:' + PORT);
});
