const Menu = require("../models/menuModel");
const Restaurant = require("../models/restaurantModel");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const { dataUri } = require("../config/multerConfig");
const { uploader, cloudinaryConfig } = require("../config/cloudinaryConfig");

cloudinaryConfig();

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
  const reqQuery = {
    ...req.query,
  };

  ignoreField = ["sort", "limit", "page"];
  ignoreField.forEach((param) => delete reqQuery[param]);

  queryStr = JSON.stringify(reqQuery);
  if (_restaurantId) {
    query = Menu.find({
      restaurant: _restaurantId,
    });
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

  if (index > 0)
    currentPage.prev = {
      Page: page - 1,
    };
  if (lastPage < totalDocuments)
    currentPage.next = {
      Page: page + 1,
    };

  res.status(200).json({
    "Found on this page": `${menu.length} of ${limit}`,
    // Pages: currentPage,
    "Total Menu": totalDocuments,
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

// @desc        Upload menu photos to cloudinary
// @routes      PUT /menu/:id/uploads
// @access      Private

exports.uploadMenuPhoto = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  let menu = await Menu.findById(_id);
  const images = req.files;

  // Validate menu id
  if (!menu) {
    return res.status(400).send(`Menu with Id not found.`);
  }
  // Upload images to Coludinary
  try {
    await images.forEach(async (image) => {
      const parseImage = dataUri(image).content;

      const result = await uploader.upload(parseImage, {
        folder: "images/menus",
      });
      console.log(result.secure_url);
      await Menu.findOneAndUpdate(
        {
          _id,
        },
        {
          $addToSet: {
            images: result.secure_url,
          },
        }
      );

      return result;
    });
  } catch (error) {
    return next(
      new ErrorResponse("Oops, an error occured, please try again", 500)
    );
  }
  return res.status(201).send({
    message: "Images uploaded succesfully",
  });
});
