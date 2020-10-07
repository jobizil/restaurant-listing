const Auth = require("../models/authModel");
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

  const authUser = await Auth.create({
    username,
    email,
    password,
    phoneNumber,
  });

  // Sends JWT Token and Cookie
  tokenResponse(authUser, 200, res);
});

// @desc    Admin Login
// @route   POST /api/v1/auth/login
// @access  Public

exports.loginAdmin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate username and password
  if (!username && !password) {
    return next(
      new ErrorResponse(", Please provide a username and a password.", 400)
    );
  }

  // Check for user in db
  const authUser = await Auth.findOne({ username }).select("+password");

  // Validate authUser's username
  if (!authUser) {
    return next(new ErrorResponse("Invalid username or password", 401));
  }
  // Match authuser's password using bcrypt compare in the auth model methods
  const matchPassword = await authUser.matchPassword(password);
  if (!matchPassword) {
    return next(new ErrorResponse("Invalid username or password", 401));
  }

  // Sends JWT Token and Cookie
  tokenResponse(authUser, 200, res);
});
