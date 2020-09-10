const express = require("express");

const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/authController");
const router = express.Router();

router.route("/").post(createRestaurant).get(getRestaurants);

router
  .route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);
module.exports = router;
