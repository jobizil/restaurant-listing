const express = require("express");

const {
  createMenu,
  getAllMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  upload,
} = require("../controllers/menuController");
const router = express.Router({
  mergeParams: true,
});

router.route("/").post(createMenu).get(getAllMenu);

router.route("/:id").get(getMenu).put(updateMenu).delete(deleteMenu);

router.route("/:id/uploads").post(upload);

module.exports = router;
