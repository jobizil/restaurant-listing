const Restaurant = require("../models/restaurantModel");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
// @desc        Create a Restaurant
// @routes      GET /api/v1/auth
// @access      Public

exports.createRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({
    success: true,
    data: restaurant,
  });
});

exports.getRestaurants = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.find();
  res.status(200).json({
    success: true,
    count: restaurant.length,
    data: restaurant,
  });
});

// @desc        Single Restaurant
// @routes      GET /api/v1/auth/restaurant/:id
// @access      Private

exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const restaurant = await Restaurant.findById(_id);
  if (!restaurant) {
    return next(
      new ErrorResponse(`Sorry, the Id ${_id} could not be fetched.`, 404)
    );
  }
  return res.json({ success: true, data: restaurant });
});

exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;

  const restaurant = await Restaurant.findByIdAndUpdate(_id, req.body, {
    new: true,
    urlValidator: true,
  });
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant with Id ${_id} not found.`), 404);
  }
  res.status(200).json({ success: true, data: restaurant });
});
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const restaurant = await Restaurant.findByIdAndRemove(_id);
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant with Id ${_id} not found.`, 404));
  }
  res.status(200).json({ success: true, data: {} });
});
