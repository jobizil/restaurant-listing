const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  menuName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required."],
    maxlength: [500, "Description should not be more than 500 Characters"],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    true,
  },
});

module.exports = mongoose.model("Menu", MenuSchema);