const mongoose = require("mongoose");
// const slugify = require("slugify");
const Schema = mongoose.Schema;
const MenuSchema = new Schema({
  menuname: {
    type: String,
    required: true,
    trim: true,
  },
 
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required."],
    maxlength: [500, "Description should not be more than 500 Characters"],
  },

  images: {
    type: [],
    default: [
      "https://res.cloudinary.com/jobizil/image/upload/v1602768183/images/menus/x4cspjvzqn2qk76sjhiw.jpg",
      "https://res.cloudinary.com/jobizil/image/upload/v1602768183/images/menus/xnurgo60mme1ewupfbin.jpg",
      "https://res.cloudinary.com/jobizil/image/upload/v1602768184/images/menus/ovni4qwzzxbufpsurlsg.jpg",
    ],
  },
  imageId: {
    type: [],
    default: ["klfjlk", "klfjlfk", "klfjlek"],
  },
  // restaurant: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Restaurant",
  // },
});


module.exports = mongoose.model("Menu", MenuSchema);
