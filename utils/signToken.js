// Create Get Token, create Cookie and send Response
exports.tokenResponse = (authUser, statusCode, res) => {
  // Generate JWToken
  const token = authUser.signToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") options.secure = true;
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ status: "success", token });
};
