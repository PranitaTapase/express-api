const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name'],
    unique: true,
    trim: true,
    minlength: [10, 'UserName must have more than 10 char'],
    maxlength: [30, 'UserName must be less than 30 char'],
  },
  email: {
    type: String,
    required: [true, 'User Email is required'],
    unique: true,
    trim: true,
    lowercase: true, //transform to lowercase
    validate: [validator.isEmail, 'Invalid Email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password is required'],
    //validator: [validator.isStrongPassword,  'Password is weak']
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Enter Password again!'],
    validate: {
      //This only works on CREATE and SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  //Only run if pass is modified
  if (!this.isModified('password')) return next();
  //Hash the pass with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete passconfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
