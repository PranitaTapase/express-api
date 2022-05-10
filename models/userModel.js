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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    //validator: [validator.isStrongPassword,  'Password is weak']
    minlength: 8,
    select: false, //Won't show in output
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
  passwordChangedAt: Date,
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

//Instance Method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //this.password not available due to select:false on password
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  //False means Not changed
  return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
