const User = require("../models/authModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Restaurant = require("../models/restaurantModel");
const Menu = require("../models/menuModel");
const { tokenResponse } = require("../utils/signToken");

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
  console.log(matchPassword);

  // Sends JWT Token and Cookie
  tokenResponse(user, 200, res);
});

// @desc    User Profile
// @route   GET /api/v1/auth/profile
// @access  Private

exports.adminProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id); //This gets current logged in user's complete details

  res.status(200).json({ status: "success", data: user });
});

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

  res.status(200).json({
    status: "success",
    data: user,
  });
});
