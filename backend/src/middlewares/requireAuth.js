const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authHeaderCheck = require("../utils/authHeader_check");

const requireAuth = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = authHeaderCheck(req);

  // Stop immediately if the token is missing or malformed
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. A valid Bearer token is required."
    });
  }

  try {
    // Verify the JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User not found."
      });
    }

    // Attach the authenticated user to the request
    req.user = user;

    // Continue to the requested route
    return next();

  } catch (error) {
    // Handle invalid, expired or improperly signed JWTs
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token."
      });
    }

    // Pass database and unexpected errors to the central error handler
    return next(error);
  }
};

module.exports = requireAuth;