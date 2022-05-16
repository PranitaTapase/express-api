const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  }); //User.save

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. check email and pass exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //2. check user exist and pass correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }
  //3. if everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, _res, next) => {
  //1. Getting token and check token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('Not Logged In! Please log in.', 400));

  //2. verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. Check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError('User doesnt exist any longer', 401));

  //4. check if Change paswword after token was issued
  if (currentUser.changePasswordAfter(decoded.iat))
    return next(new AppError('User recently changed password', 401));

  //Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, _res, next) => {
    //roles: ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permission denied.', 403));
    }
    next();
  };

//Forgot Password reset
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1. Get user from email
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError('Email doesnt exist', 404));

  //2. Generate random rest token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3. send it to user's mail
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot Password? Path Request with new Pass ${resetURL}. Bunch of words. Bunch of words.Bunch of words.Bunch of words.Bunch of words.`;
  console.log(message);
  try {
    await sendEmail({
      email: user.email,
      subject: 'Vaild for 10 mins',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to mail!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was a error sending the mail. Try again later', 500)
    );
  }
});
exports.resetPassword = (req, res, next) => {
  console.log('here');
  next();
};
