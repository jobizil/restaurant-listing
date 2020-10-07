const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = (require = require("../models/authModel"));

// ProtectRoutes from unauthorized manipulation
exports.restrict = asyncHandler(async (req, res, next) => {
  const headers = req.headers.authorization;
  let token;

  // Check for authorization headers
  if (headers && headers.startsWith("Bearer ")) {
    // Extract token
    token = req.headers.authorization.split(" ")[1];
  }
  // Verify if token exists
  if (!token) {
    return next(
      new ErrorResponse(`You do not have access to this route.`, 401)
    );
  }

  // Verify if token exists
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decodedToken);
    req.user = await User.findById(decodedToken.id); //Always identifies current logged in User. Used for all private routes
    next();
  } catch (error) {
    return next(
      new ErrorResponse("You do not have access to this route.", 401)
    );
  }
});
