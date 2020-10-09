const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  adminProfile,
  forgotPassword,
  resetPassword,
  logoutAdmin,
} = require("../controllers/authController");
const { restrict } = require("../middleware/authProcess");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/logout", logoutAdmin);
router.get("/profile", restrict, adminProfile);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetPassword/:resettoken", resetPassword);

module.exports = router;
