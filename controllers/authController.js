const Restaurant = require("../models/restaurantModel");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");

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
  let query;
  const queryReq = { ...req.query };

  const ignoreField = ["select"];
  // Loop through params
  ignoreField.forEach((param) => delete queryReq[param]);
  let queryStr = JSON.stringify(queryReq);
  queryStr = queryStr.replace(/\b(in)\b/g);

  query = Restaurant.find(JSON.parse(queryStr));
  if (req.query.select) {
    const field = req.query.select.split(",").join(" ");
    console.log(field);
    query = query.select(field);
  }
  const restaurant = await query;
  res.json({
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

// ========================

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

// =================================
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const restaurant = await Restaurant.findByIdAndRemove(_id);
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant with Id ${_id} not found.`, 404));
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc        Upload photo
// @routes      PUT /restaurant/:id/photo
// @access      Private

exports.uploadRestaurantPhoto = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const restaurant = await Restaurant.findById(_id);
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant with Id ${_id} not found.`, 404));
  }
  // Check if file was uploaded
  if (!req.files) {
    return next(new ErrorResponse("Please upload a photo.", 400));
  }

  let file = req.files.photo;

  // validate Uploaded file if its a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Sorry, upload only images`, 400));
  }
  // validate file size
  if (file.size > process.env.FILE_SIZE) {
    return next(new ErrorResponse(`Sorry, file is bigger than 2mb`, 400));
  }

  // Customise file name
  file.name = `photo_${restaurant.slug}${path.parse(file.name).ext}`;

  // Store in path folder
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("Could not upload file", 500));
    }
    // Insert in DB
    await Restaurant.findByIdAndUpdate(_id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
