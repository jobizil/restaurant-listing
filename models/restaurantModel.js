const mongoose = require("mongoose");
const slugify = require("slugify");
const Menu = require("./menuModel");

const Schema = mongoose.Schema;
const RestaurantSchema = new Schema(
  {
    businessname: {
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
    location: {
      type: String,
      trim: true,
      required: [true, "Please input a location."],
      default: "Lagos",
    },
    phone: {
      type: String,
      trim: true,
      default: "08145290260",
    },
    averagecost: {
      type: Number,
      default: 700,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/jobizil/image/upload/v1602289542/images/restaurant/rhpnydmmfj8kejlzecq6.jpg",
    },
    imageId: {
      type: String,
      default: "kleewjlk",
    },
    restauranttype: {
      type: String,
      lowercase: true,
      enum: ["eatery", "bukka", "canteen"],
      default: "canteen",
    },
      menu: {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    slug: String,
    direction: String,
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: false,
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
  this.slug = slugify(this.businessname, {
    lower: true,
  });
  next();
});

// Cascade Delete menu attached to Restaurant
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
