const express = require("express");
const { restrict } = require("../middleware/authProcess");

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

const { multerUpload } = require("../config/multerConfig");

router.route("/").post(restrict, createMenu).get(getAllMenu);

router
  .route("/:id")
  .get(getMenu)
  .put(restrict, updateMenu)
  .delete(restrict, deleteMenu);

router.post(
  "/:id/upload",
  restrict,
  multerUpload.array("photos", 4),
  uploadMenuPhoto
);

module.exports = router;
