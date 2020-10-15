// const path = require("path");
const Restaurant = require("../models/restaurantModel");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const { dataUri } = require("../config/multerConfig");
const { uploader, cloudinaryConfig } = require("../config/cloudinaryConfig");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config" });

cloudinaryConfig();

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
  const reqQuery = {
    ...req.query,
  };

  // Exclude fields when being matched for filtering
  ignoreFields = ["select", "sort", "limit", "page"];

  // Loop through ignoreFields on reqQuery and delete
  ignoreFields.forEach((param) => delete reqQuery[param]);

  // Convert json into string
  let queryString = JSON.stringify(reqQuery);

  // Set up a regex for filtering of query params
  queryString = queryString.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => `$${match}`
  );

  // Find data in database and Populate
  query = Restaurant.find(JSON.parse(queryString)).populate({
    path: "foodMenu",
    select: "menuName",
  });

  // Select param's value
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort param's value
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-reviews");
  }
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const indexPage = (page - 1) * limit;
  const lastPage = page * limit;
  const totalDocuments = await Restaurant.countDocuments();
  query = query.skip(indexPage).limit(limit);

  const restaurant = await query;

  // Validate current page number
  currentPage = {};
  if (indexPage > 0)
    currentPage.prev = {
      page: page - 1,
    };
  if (lastPage < totalDocuments)
    currentPage.next = {
      page: page + 1,
    };

  res.json({
    "Found on this page": `${restaurant.length} of ${limit}`,
    currentPage,
    "Total Restaurants": totalDocuments,
    Result: restaurant,
  });
});

// @desc        Single Restaurant
// @routes      GET /api/v1/auth/restaurant/:id
// @access      Private

exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const restaurant = await Restaurant.findById(_id).populate({
    path: "foodMenu",
    select: "menuName description images",
  });
  if (!restaurant) {
    return next(
      new ErrorResponse(`Sorry, the Id ${_id} could not be fetched.`, 404)
    );
  }
  return res.json({
    success: true,
    data: restaurant,
  });
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
  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

// =================================
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const restaurant = await Restaurant.findById(_id);
  if (!restaurant)
    return next(new ErrorResponse(`Restaurant with Id ${_id} not found.`, 404));

  restaurant.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/** @desc        Upload photo
    @routes      PUT /restaurant/:id/photo
    @access      Private
*/
exports.uploadRestaurantPhoto = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const image = req.file;

  // Validate restaurant ID
  const restaurant = await Restaurant.findById(_id);
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant with Id ${_id} not found.`, 404));
  }

  if (!image) {
    return next(new ErrorResponse("Please upload a photo.", 400));
  }
  if (restaurant.imageId) {
    await uploader.destroy(restaurant.imageId);
  }
  // Validate Uploaded file if its a photos
  if (!image.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Sorry, only images can be uploaded", 400));
  }

  // validate file size
  if (image.size > process.env.FILE_SIZE) {
    return next(new ErrorResponse(`Sorry, file is bigger than 4mb`, 400));
  }
  const parseImage = dataUri(image).content;

  try {
    const result = await uploader.upload(parseImage, {
      folder: "images/restaurant",
    });

    // Save to db
    await Restaurant.findByIdAndUpdate(_id, {
      image: result.secure_url,
      imageId: result.public_id,
    });
    return res.status(201).json({
      message: "Photo uploaded successfully.",
      data: result.secure_url,
    });
  } catch (error) {
    // console.error(error);
    return next(
      new ErrorResponse("Could not upload image, please try again", 500)
    );
  }
});
