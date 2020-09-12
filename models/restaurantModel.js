const mongoose = require("mongoose");
const slugify = require("slugify");

const geocoder = require("../utils/geocoder");

const RestaurantSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Please input a restaurant name."],
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
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
      default: "myrestaurant@gmail.com",
      unique: true,
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
    averageCost: Number,
    photo: {
      type: String,
      default: "default.jpg",
    },
    restaurantType: {
      type: String,
      enum: ["Eatry", "Bukka", "Canteen"],
      default: "Canteen",
    },
    slug: String,
    direction: String,
  },
  { timestamps: true }
);

// Convert name to slug for front end consumption
RestaurantSchema.pre("save", function (next) {
  this.slug = slugify(this.businessName, { lower: true });
  next();
});
/**
// Get GeoJSON Location of address
RestaurantSchema.pre("save", async function (next) {
  let loc = await geocoder.geocode(this.address); //Returns an array
  let result = loc[0];
  this.location = {
    type: "Point",
    coordinates: [result.longitude, result.latitude],
    formattedAddress: result.formattedAddress,
    street: result.streetName,
    city: result.city,
    state: result.state,
    country: result.country,
  };
  this.address = undefined;

  next();
});
*/

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
