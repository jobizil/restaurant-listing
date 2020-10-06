const express = require("express");

const {
  createMenu,
  getAllMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  uploadMenuPhoto,
} = require("../controllers/menuController");
const router = express.Router({
  mergeParams: true,
});

const { multerUpload } = require('../config/multerConfig')

router.route("/").post(createMenu).get(getAllMenu);

router.route("/:id").get(getMenu).put(updateMenu).delete(deleteMenu);

router.post("/:id/upload", multerUpload.array('photos', 4), uploadMenuPhoto);

module.exports = router;
