const mongoose = require("mongoose");

const connectDB = async () => {
  const DB = process.env.MONGO || DB_URI; //DB_URI is linked with server env
  const connection = await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Mongodb connected to ${connection.connection.host}`);
};
module.exports = connectDB;
