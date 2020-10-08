const express = require("express");
const { restrict, authorizeRole } = require("../middleware/authProcess");

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

router
  .route("/")
  .post(restrict, authorizeRole("superAdmin", "admin"), createMenu)
  .get(getAllMenu);

router
  .route("/:id")
  .get(getMenu)
  .put(restrict, authorizeRole("superAdmin", "admin"), updateMenu)
  .delete(restrict, authorizeRole("superAdmin"), deleteMenu);

router.post(
  "/:id/upload",
  restrict,
  authorizeRole("superAdmin", "admin"),
  multerUpload.array("photos", 4),
  uploadMenuPhoto
);

module.exports = router;
