const express = require("express");

const {
  createMenu,
  getAllMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  uploadMenuPhoto,
} = require("../controllers/menuController");
const router = express.Router({ mergeParams: true });

router.route("/").post(createMenu).get(getAllMenu);

router.route("/:id").get(getMenu).put(updateMenu).delete(deleteMenu);

router.route("/uploads").post(uploadMenuPhoto);

module.exports = router;
