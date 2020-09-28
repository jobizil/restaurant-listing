const mongoose = require("mongoose");
const slugify = require("slugify");
const Menu = require("./menuModel");

const geocoder = require("../utils/geocoder");
const Schema = mongoose.Schema;
const RestaurantSchema = new Schema(
  {
    businessName: {
      type: String,
      required: [true, "Please input a restaurant name."],
      lowercase: true,
      trim: true,
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please enter a valid URL like HTTP or HTTPS.",
      ],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
      unique: true,
    },
    reviews: {
      type: Number,
      default: 10,
    },
    parkinglot: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Please input an address."],
    },
    averageCost: {
      type: Number,
      default: 700,
    },
    photo: {
      type: Buffer,
    },
    restaurantType: {
      type: String,
      lowercase: true,
      enum: ["eatery", "bukka", "canteen"],
      default: "canteen",
    },
    slug: String,
    direction: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Populate with virtuals
RestaurantSchema.virtual("foodMenu", {
  ref: "Menu",
  foreignField: "restaurant",
  localField: "_id",
  justOne: false,
});

// Convert name to slug for frontend consumption
RestaurantSchema.pre("save", function (next) {
  this.slug = slugify(this.businessName, {
    lower: true,
  });
  next();
});

// Delete menu attached to Restaurant
RestaurantSchema.pre("remove", async function (next) {
  await Menu.deleteMany({ restaurant: this._id });
  next();
});

// Generate Unique email through businessName
RestaurantSchema.pre("save", function (next) {
  if (!this.email) {
    this.email = `${this.slug}@gmail.com`;
  }
  next();
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
