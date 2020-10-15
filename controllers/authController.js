const asyncHandler = require("../middleware/asyncHandler");
const Restaurant = require("../models/restaurantModel");
const User = require("../models/authModel");
const Menu = require("../models/menuModel");
const ErrorResponse = require("../utils/errorResponse");
const { tokenResponse } = require("../utils/signToken");
const sendMail = require("../utils/resetEmail");
const crypto = require("crypto");

// @desc    Register an Admin
// @route   POST /api/v1/auth/register
// @access  Public

exports.registerAdmin = asyncHandler(async (req, res, next) => {
  const { username, email, password, phoneNumber } = req.body;
  const createProfile = await User.create({
    username,
    email,
    password,
    phoneNumber,
  });
  // Sends JWT Token and Cookie
  tokenResponse(createProfile, 200, res);
});

// @desc    Admin Login
// @route   POST /api/v1/auth/login
// @access  Public

exports.loginAdmin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate username and password
  if (!username || !password) {
    return next(
      new ErrorResponse("Please provide a username and password", 400)
    );
  }

  // Validate username
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(
      new ErrorResponse("Please provide a valid username and password", 401)
    );
  }

  // Validate Password
  const matchPassword = await user.matchPassword(password);
  if (!matchPassword) {
    return next(
      new ErrorResponse("Please provide a valid username and password", 401)
    );
  }

  // Sends JWT Token and Cookie
  tokenResponse(user, 200, res);
});

// @desc    Logout
// @route   GET /api/v1/auth/logout
// @access  Private

exports.logoutAdmin = asyncHandler(async (req, res, next) => {
  res.cookie("token", " ", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "You are logged out. We hope to see you soon.",
  });
});

// @desc    Forgot Password
// @route   GET /api/v1/auth/forgotPassword
// @access  Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Extract email from user body

  const user = await User.findOne({ email: req.body.email });
  // Check for user with the email
  if (!user) {
    return next(new ErrorResponse(`No valid user with such email.`, 404));
  }
  // Reset Token method is gotten from model methods
  const passwordToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  // Create resetURL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${passwordToken}`;

  const message = `Password reset token \n\n ${resetURL}`;

  // Call sendMail function
  try {
    sendMail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    return res.status(200).json({
      status: "success",
      message: "Reset Token sent",
    });
  } catch (error) {
    // Remove token and expire time from db if error occurs
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return new ErrorResponse(`Email coluld not be sent.`, 500);
  }
});

/**
@desc    Reset Password
@route   GET /api/v1/auth/resetpassword/:resettoken
@access  Public
*/

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  // Find user by resettoken and validate it's expiration time (validate if it's greater than the current time)

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorResponse(`Invalid reset token.`, 400));
  }

  // Accept new password if token is valid
  user.password = req.body.password;

  // Remove token and expire from database.

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Save new password
  await user.save();
  // Sends JWT Token and Cookie
  tokenResponse(user, 200, res);
});

/**

@desc    User Profile
@route   GET /api/v1/auth/profile
@access  Private

exports.adminProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ status: "success", data: user });
});

*/
