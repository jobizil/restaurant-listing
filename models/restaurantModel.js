const mongoose = require("mongoose");
const slugify = require("slugify");

const geocoder = require("../utils/geocoder");

const RestaurantSchema = new mongoose.Schema(
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
    parkinglot: {
      type: Boolean,

      default: false,
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Please input an address."],
    },
    location: {
      // GeoJSON Points
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere", //Example of 2dsphere:[ -73.97, 40.77 ]
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must be at most 10"],
    },
    averageCost: {
      type: Number,
      default: 1000,
    },
    photo: {
      type: Buffer,
    },
    restauranttype: {
      type: String,
      lowercase: true,
      enum: ["eatery", "bukka", "canteen"],
      default: "canteen",
    },
    slug: String,
    direction: String,
  },
  {
    timestamps: true,
  }
);

// Reverse Populate with virtuals
RestaurantSchema.virtual("menu", {
  ref: "Menu",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});

// Convert name to slug for frontend consumption
RestaurantSchema.pre("save", function (next) {
  this.slug = slugify(this.businessName, {
    lower: true,
  });
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
