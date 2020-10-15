const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = (require = require("../models/authModel"));

// ProtectRoutes from unauthorized manipulation
exports.restrict = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
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
    req.user = await User.findById(decodedToken.id);
    //Always identifies current logged in User. Used for all private routes
    next();
  } catch (error) {
    return next(
      new ErrorResponse("You do not have access to this route.", 401)
    );
  }
});

// Grant access specific roles
exports.authorizeRole = (...role) => (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse("Unauthorized access to this route.", 401));
  }
  if (!role.includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User with role '${req.user.roles}' is not authorized access this route.`,
        403
      )
    );
  }
  next();
};
