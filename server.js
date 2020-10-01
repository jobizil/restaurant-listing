const express = require("express");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");

dotenv.config({ path: "./config/config.env" });

// External Files
const connectDB = require("./config/dbConfig");
const restaurant = require("./routes/restaurantRouter");
const menu = require("./routes/menuRouter");


const errorHandler = require("./middleware/errorHandler");

const app = express();

PORT = process.env.PORT || 3500;
// Body Parser
app.use(express.json());
// Upload photo
app.use(fileUpload());

//  Set static folders
app.use(express.static(path.join(__dirname, "public")));

// Connect to Database
connectDB();

const API_VERSION = process.env.API_VERSION || 'v1'


// Add Router
// app.use("/api/v1/auth/restaurant", auth);
// app.use("/api/v1/auth/menu", menu);
app.use(`/api/${API_VERSION}/restaurant`, restaurant)
app.use(`/api/${API_VERSION}/menu`, menu)

app.get('*', (req, res)=>{
  res.send(`<h2>404, page not found</h2><h4> Proper documentation coming in soon!</h4>`)
})


app.use(errorHandler);

const SERVER = app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);
// HandleUnhandledPromiseRejection from Mongo Connection
process.on("unhandledRejection", (error, promise) => {
  console.log(`${error.message}`);
  SERVER.close(() => process.exit(1));
});
