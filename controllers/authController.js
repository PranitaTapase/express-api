const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  }); //User.save
  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
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
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. Get USer based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2. If token has not expired, and there is user,set a new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3. Update changedPasswordAt property for the user: Done in userModel through middleware

  //4. Log theuser in, send JWT
  createSendToken(user, 200, res);
  next();
});

//Update password for logged in user
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //2. check if posted current password correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your password is wrong', 401));
  }
  //3. if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4/ log user in, send jwt
  createSendToken(user, 200, res);
  next();
});
