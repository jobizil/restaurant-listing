const express = require("express");
const { multerUpload } = require("../config/multerConfig");

const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  uploadRestaurantPhoto,
} = require("../controllers/restaurantController");
// Include other resource Route
const menu = require("./menuRouter");

const router = express.Router();

// Connect to external routers to access its entity
router.use("/:restaurantId/menu", menu);

router.route("/").post(createRestaurant).get(getRestaurants);

router
  .route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);

router.post("/:id/photo", multerUpload.single("image"), uploadRestaurantPhoto);

module.exports = router;
