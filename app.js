
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportConfig = require('./config/Passport');
const User = require('./models/User'); // Adjust the path to your User model
const Post = require('./models/Post'); // Adjust the path to your Post model

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, this is the root path!');
});
app.get('/landing', (req, res) => {
  res.render('landing');
});

// View engine setup ('views' folder)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));

// Express session setup
app.use(
  session({
    secret: 'H8tWrTZN', 
    resave: false,
    saveUninitialized: false,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Database connection using Mongoose
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Routes setup
app.get('/secret', isLoggedIn, (req, res) => {
  res.render('secret'); // Render your secret.pug file for authenticated users
});

app.get('/register', (req, res) => {
  res.render('register'); // Render your register.pug file for registration
});

app.post('/register', (req, res) => {
  
  const { username, password } = req.body;

  User.register(
    new User({ username }),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.render('register'); // Handle registration errors
      }
      passport.authenticate('local')(req, res, function () {
        res.redirect('/login'); // Redirect after successful registration
      });
    }
  );
});

app.get('/login', (req, res) => {
  res.render('login'); // Render your login.pug file for login
});


app.post('/login', passport.authenticate('local', {
  successRedirect: '/account', // Redirect to the account management page after successful login
  failureRedirect: '/login',
}));




app.get('/account', isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: 'desc' });
    res.render('account', { posts });
  } catch (err) {
    res.send('Error fetching posts');
  }
});
app.get('/add', (req, res) => {
  res.render('add'); // Render your form to add a new post
});



app.get('/account', isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: 'desc' });
    res.render('account', { posts });
  } catch (err) {
    res.send('Error fetching posts');
  }
});

// For adding a post
app.post('/account/add', async (req, res) => {
  try {
    await Post.create(req.body);
    res.redirect('/account'); // Redirect to the account page after adding
  } catch (err) {
    res.send('Error adding post');
  }
});



// For editing a post
app.get('/account/edit/:id', isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('edit', { post }); // Render the 'edit' Pug file with the post data
  } catch (err) {
    res.redirect('/account');
  }
});

app.post('/account/edit/:id', isLoggedIn, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/account'); // Redirect to the account page after editing
  } catch (err) {
    res.redirect('/account');
  }
});



// For deleting a post
app.post('/account/delete/:id', isLoggedIn, async (req, res) => {
  try {
    console.log('Delete route reached');
    await Post.findOneAndDelete({ _id: req.params.id });
    console.log('Post deleted successfully');
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.redirect('/account');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = app;