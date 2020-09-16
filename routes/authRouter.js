const express = require("express");

const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  uploadRestaurantPhoto,
} = require("../controllers/authController");
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

router.route("/:id/photo").put(uploadRestaurantPhoto);
module.exports = router;
