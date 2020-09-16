const Menu = require("../models/menuModel");
const Restaurant = require("../models/restaurantModel");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Create a Menu
// @routes      POST /api/v1/auth/restaurant/:restaurantId/menu
// @access      Private

exports.createMenu = asyncHandler(async (req, res, next) => {
  req.body.restaurant = req.params.restaurantId;
  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    return next(
      new ErrorResponse(
        `No Restaurant with Id ${req.params.restaurantId} found`,
        404
      )
    );
  }

  const menu = await Menu.create(req.body);
  res.status(201).json({
    success: true,
    Result: menu,
  });
});

// ========================

// @desc        Get all Menu
// @routes      GET /api/v1/auth/menu
// @routes      GET /api/v1/auth/restaurant/:restaurantId/menu
// @access      Public

exports.getAllMenu = asyncHandler(async (req, res, next) => {
  const _restaurantId = req.params.restaurantId;
  let query;

  if (_restaurantId) {
    query = Menu.find({
      restaurant: _restaurantId
    });
  } else {
    query = Menu.find().populate("restaurant");
  }

  const menu = await query;
  res.status(200).json({
    "Total Found": menu.length,
    Result: menu
  });
});

// ============

// @desc        Get single Menu
// @routes      GET /api/v1/auth/menu/:id
// @access      Private

exports.getMenu = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const menu = await Menu.findById(_id).populate({
    path: "restaurant",
    select: 'businessName email restaurantType address'
  });
  if (!menu) {
    return next(new ErrorResponse(`No menu with Id ${_id} found`, 404));
  }
  res.status(200).json({
    Result: menu
  });
});

// ============

// @desc        Get Update Menu
// @routes      PUT /api/v1/auth/menu/:id
// @access      Private
exports.updateMenu = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const menu = await Menu.findByIdAndUpdate(_id, req.body, {
    new: true,
    urlValidator: true,
  });
  if (!menu) {
    return next(
      new ErrorResponse(
        `Could not update Menu. No menu with Id ${_id} found`,
        404
      )
    );
  }
  res.status(200).json({
    result: menu,
  });
});

// ============

// @desc        Get Delete Menu
// @routes      PUT /api/v1/auth/menu/:id
// @access      Private
exports.deleteMenu = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const menu = await Menu.findByIdAndDelete(_id);
  if (!menu) {
    return next(
      new ErrorResponse(
        `Could not delete Menu. No menu with Id ${_id} found`,
        404
      )
    );
  }
  res.status(200).json({
    result: {},
  });
});