const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = (require = require("../models/authModel"));

// ProtectRoutes from unauthorized manipulation
exports.restrict = asyncHandler(async (req, res, next) => {
  // const headers = req.headers.authorization;
  let token;

  // Check for authorization headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract token
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Verify if token exists
  if (!token) {
    return next(
      new ErrorResponse(`You do not have access to this route.`, 401)
    );
  }
  // Validate token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id); //Always identifies current logged in User. Used for all private routes
    next();
  } catch (error) {
    return next(
      new ErrorResponse("You do not have access to this route.", 401)
    );
  }
});

// Grant access specific roles
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        new ErrorResponse(
          `User with role '${req.user.roles}' is not authorized access this route.`,
          403
        )
      );
    }
    next();
  };
};
