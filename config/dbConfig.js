const mongoose = require("mongoose");

const connectDB = async () => {
  const DB = process.env.DB_URI || DB_URI; //DB_URI is linked with server env
  const connection = await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  // c.l(`Mongodb connected to ${connection.connection.host}`);
};
module.exports = connectDB;
