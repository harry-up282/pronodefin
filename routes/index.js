const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Registration = require('../models/Registration'); // Assuming your model for user registration is defined here

router.get('/register', function(req, res) {
  res.render('register'); // Render your registration form view
});

router.post('/register', [
  // Validation for registration form fields
  check('name').notEmpty().withMessage('Name cannot be empty'),
  check('email').isEmail().withMessage('Please enter a valid email'),
  // Add more validation for other fields like password, etc.
], async function(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('register', { errors: errors.array(), data: req.body }); // Render the form with validation errors
  }

  try {
    const newRegistration = await Registration.create(req.body); // Assuming your model allows creation of new registrations
    res.send('Thank you for your registration!'); // Send a success message or redirect to login page
  } catch (err) {
    console.error(err);
    res.send('Sorry! Something went wrong.'); // Handle registration failure
  }
});

module.exports = router;
