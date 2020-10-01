const mongoose = require("mongoose");

const connectDB = async () => {
  let DB_URI = process.env.DB_URI || DB_URI
  const connection = await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Mongodb connected to ${connection.connection.host}`);
};
module.exports = connectDB;
