const mongoose = require("mongoose");
const slugify = require("slugify");

const MenuSchema = new mongoose.Schema({
  menuName: {
    type: String,
    required: true,
    trim: true,
  },
  slug: String,
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required."],
    maxlength: [500, "Description should not be more than 500 Characters"],
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    min: 0,
    default: 0,
  },
  photo: {
    type: Buffer,

  },
  // photo: Buffer,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
}, {
  timestamps: true,
});

// Convert name to slug for front end consumption
MenuSchema.pre("save", function (next) {
  this.slug = slugify(this.menuName, {
    lower: true,
  });
  next();
});

module.exports = mongoose.model("Menu", MenuSchema);