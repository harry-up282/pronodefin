const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
    // Add more validation, like match or custom validators for email format if needed
  },
  password: {
    type: String,
    required: true,
    // Other password validations or hashing can be added here
  },
});

module.exports = mongoose.model('Registration', registrationSchema);
