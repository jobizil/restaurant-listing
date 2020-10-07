const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const AuthSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username cannot be blank."],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email cannot be blank."],
    trim: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email.",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [6, "Password should contain a minimum of 6 characters."],
    select: false,
  },
  phoneNumber: {
    type: Number,
    trim: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Sign JWT and return

AuthSchema.methods.signToken = function () {
  const auth = this;
  return jwt.sign(
    {
      id: auth._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Encrypt Password before writing to db
AuthSchema.pre("save", async function (next) {
  const auth = this;
  // if (auth.isModified("password")) next();
  // Generate hash using salt
  const hash = await bcrypt.genSalt(10);
  auth.password = await bcrypt.hash(auth.password, hash);
  next();
  console.log(hash);
});

// Match password for loginAdmin
AuthSchema.methods.matchPassword = async function (passwordFromUser) {
  const user = this;
  return await bcrypt.compare(passwordFromUser, user.password);
};

module.exports = mongoose.model("User", AuthSchema);
