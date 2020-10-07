const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({
  path: "./config/config.env",
});

// External Files
const connectDB = require("./config/dbConfig");
const restaurant = require("./routes/restaurantRouter");
const menu = require("./routes/menuRouter");
const auth = require("./routes/authRouter");

const errorHandler = require("./middleware/errorHandler");

const app = express();

PORT = process.env.PORT || 3500;

API_VERSION = process.env.API_VERSION || "v1";

// Body Parser
app.use(express.json());

// Connect to Database
connectDB();

// Load Routers
app.use(`/api/${API_VERSION}/restaurant`, restaurant);
app.use(`/api/${API_VERSION}/menu`, menu);
app.use(`/api/${API_VERSION}/auth`, auth);

// Page not found error
app.get("*", (req, res) => {
  res.send(
    `<h2>404, page not found</h2><h4> Proper documentation <a href = "https://documenter.getpostman.com/view/12204297/TVKJwEWL" target="blank" >here<a/> using postman!</h4>`
  );
});

// Load errroHandler
app.use(errorHandler);

// Load cookieParser
app.use(cookieParser());

const SERVER = app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// HandleUnhandledPromiseRejection from Mongo Connection
// process.on("unhandledRejection", (error, promise) => {
//   console.log(`${error.message}`);
//   SERVER.close(() => process.exit(1));
// });
