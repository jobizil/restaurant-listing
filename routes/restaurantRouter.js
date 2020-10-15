const express = require("express");

const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  uploadRestaurantPhoto,
} = require("../controllers/restaurantController");
const { multerUpload } = require("../config/multerConfig");
const { restrict, authorizeRole } = require("../middleware/authProcess");
// Include other resource Route
const menu = require("./menuRouter");

const router = express.Router();

// Connect to external routers to access its entity
router.use("/:restaurantId/menu", menu);

router
  .route("/")
  .post(restrict, authorizeRole("admin"), createRestaurant)
  .get(getRestaurants);

router
  .route("/:id")
  .get(getRestaurant)
  .put(restrict, authorizeRole("superAdmin", "admin"), updateRestaurant)
  .delete(restrict, authorizeRole("superAdmin"), deleteRestaurant);

router.post(
  "/:id/photo",
  restrict,
  authorizeRole("superAdmin", "admin"),
  multerUpload.single("image"),
  uploadRestaurantPhoto
);

module.exports = router;
