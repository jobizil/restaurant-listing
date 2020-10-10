const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //
  // if (error.name === "CastError") {
  //   const message = `Restaurant with such Id not found.`;
  //   error = new ErrorResponse(message, 404);

  if (error.name === "CastError") {
    const message = `No such Id found.`;
    error = new ErrorResponse(message, 404);
  }
  // Handles Mongoose bad ObjectId
  if (error.code === 11000) {
    const message = "Oops, duplicate value entered";
    error = new ErrorResponse(message, 400);
  }
  if (error.kind === "ObjectId") {
    const message = "Id entered is not valid.";
    error = new ErrorResponse(message, 400);
  }
  // Mongoose Validation error
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }
  return res.status(error.statusCode || 500).json({
    error: error.message || "Server Error!",
  });
};
module.exports = errorHandler;
