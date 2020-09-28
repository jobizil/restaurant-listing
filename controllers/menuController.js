const Menu = require("../models/menuModel");
const Restaurant = require("../models/restaurantModel");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");
const multer = require("multer");

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

// @desc        Get all Menu linked to a restaurant
// @routes      GET /api/v1/auth/menu
// @routes      GET /api/v1/auth/restaurant/:restaurantId/menu
// @access      Public

exports.getAllMenu = asyncHandler(async (req, res, next) => {
  const _restaurantId = req.params.restaurantId;
  let query;
  const reqQuery = { ...req.query };

  ignoreField = ["sort", "limit", "page"];
  ignoreField.forEach((param) => delete reqQuery[param]);

  queryStr = JSON.stringify(reqQuery);
  if (_restaurantId) {
    query = Menu.find({ restaurant: _restaurantId });
  } else {
    query = Menu.find(JSON.parse(queryStr)).populate("restaurant");
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("menuName");
  }
  const limit = parseInt(req.query.limit, 10) || 5;
  const page = parseInt(req.query.page, 10) || 1;
  const index = (page - 1) * limit;
  const lastPage = page * limit;
  const totalDocuments = await Menu.countDocuments();

  query = query.skip(index).limit(limit);

  const menu = await query;
  currentPage = {};

  if (index > 0) currentPage.prev = { Page: page - 1 };
  if (lastPage < totalDocuments) currentPage.next = { Page: page + 1 };

  res.status(200).json({
    "Found on this page": `${menu.length} of ${limit}`,
    // Pages: currentPage,
    Result: menu,
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
    select: "businessName restaurantType address",
  });
  if (!menu) {
    return next(new ErrorResponse(`No menu with Id ${_id} found`, 404));
  }
  res.status(200).json({
    Result: menu,
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

// @desc        Upload photo
// @routes      PUT /menu/photos
// @access      Private

// Multer Configuration

const uploadFile = multer({
  limits: {
    files: 8,
  },
});

exports.upload =
  (uploadFile.array("photos", 8),
  async (req, res, next) => {
    const photos = req.files;
    const _id = req.params.id;
    const menu = await Menu.findById(_id);

    // Check if menu id is valid
    if (!menu) {
      return next(new ErrorResponse(`Menu with ${_id} is not found.`, 404));
    }

    // Check if any photo is selected for upload
    if (!photos) {
      return next(new ErrorResponse("No photo selected.", 400));
    } else {
      let data = [];
      // Loop through req.files.photos
      for (let key in req.files.photos) {
        if (req.files.photos.hasOwnProperty(key)) {
          // Assign photos arrays to a variable
          let photoURL = req.files.photos[key];

          //Generate random date and Pick last 3 digits of tiimestamp generated
          let today = new Date();
          today = Date.now().toString().slice(-3);
          let rand = Math.floor(Math.random() * 10000);

          // Rename uploaded files
          photoURL.name = `menu_${rand}${today}${
            path.parse(photoURL.name).ext
          }`;

          // Validate uploaded file
          if (!photoURL.mimetype.startsWith("image")) {
            return next(new ErrorResponse("Photos only", 400));
          }
          // Validate uploaded file size
          if (photoURL.size > process.env.FILE_SIZE) {
            return next(
              new ErrorResponse("Sorry, file is larger than 2mb", 400)
            );
          }
          data.push({
            name: photoURL.name,
            data: photoURL.data,
            mimeType: photoURL.mimeType,
            size: photoURL.size,
          });
          await Menu.findByIdAndUpdate(_id, {
            photo: photoURL.data,
          });
        }
      }
      return res.json({
        status: true,
        message: "Photos uploaded successfully.",
      });
    }
    console.log(error);
  });
