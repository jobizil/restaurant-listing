const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  adminProfile,
  forgotPassword,
} = require("../controllers/authController");
const { restrict } = require("../middleware/authProcess");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", restrict, adminProfile);
router.post("/forgotpassword", forgotPassword);

module.exports = router;
