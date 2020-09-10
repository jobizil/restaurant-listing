const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

// External Files
const connectDB = require("./config/dbConfig");
const auth = require("./routes/authRouter");
const errorHandler = require("./middleware/errorHandler");

const app = express();

PORT = process.env.PORT || 3500;
// Body Parser
app.use(express.json());

// Connect to Database
connectDB();

// Add Router
app.use("/api/v1/auth/restaurant", auth);

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
