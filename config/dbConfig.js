const mongoose = require("mongoose");

const connectDB = async () => {
  const DB_URI = 'mongodb+srv://quill-tech:HELLOworld081@quilltech.d2rzs.mongodb.net/restaurant-listing?retryWrites=true&w=majority'
  const connection = await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Mongodb connected to ${connection.connection.host}`);
};
module.exports = connectDB;
