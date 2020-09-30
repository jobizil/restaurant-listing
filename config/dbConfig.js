const mongoose = require("mongoose");

const connectDB = async () => {
  const connection = await mongoose.connect(mongodb+srv://quill-tech:HELLOworld081@quilltech.d2rzs.mongodb.net/restaurant-listing?retryWrites=true&w=majority, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Mongodb connected to ${connection.connection.host}`);
};
module.exports = connectDB;
