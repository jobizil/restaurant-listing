const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  adminProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { restrict } = require("../middleware/authProcess");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", restrict, adminProfile);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetPassword/:resettoken", resetPassword);

module.exports = router;
