const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Import authentication and route modules
const userRoutes = require("./routes/user_routes");
const createApiRoutes = require("./routes/apiRoutes");
const requireAuth = require("./middlewares/requireAuth");

// Import application middleware
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error_handler");

const app = express();

// Security configuration
app.use(helmet());

// Configure Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CLIENT_URL || "http://127.0.0.1:4173" || "http://10.67.52.81:5500"
}));

// Parse incoming JSON requests
app.use(express.json({ limit: "10kb" }));

// Application logger
app.use(logger);

// Public health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HealthMate API is running',
    timestamp: new Date().toISOString()
  });
});

// Public authentication endpoints
app.use("/auth", userRoutes);

// Protected medication and dashboard endpoints
app.use("/api", createApiRoutes(requireAuth));
// Central error handler (must remain last)
app.use(errorHandler);

module.exports = app;