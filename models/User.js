const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String // In a production app, consider hashing passwords for security
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);