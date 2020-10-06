const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;
const MenuSchema = new Schema({
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

  images: {
    type: []
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
  },
});

// Convert name to slug for front end consumption
MenuSchema.pre("save", function (next) {
  this.slug = slugify(this.menuName, {
    lower: true,
  });
  next();
});

module.exports = mongoose.model("Menu", MenuSchema);
