const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require("./routes/user_routes");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error_handler");

const app = express();

// Security and application middleware
app.use(helmet());

app.use(cors('*'));

app.use(express.json({ limit: '10kb' }));

app.use(logger);
app.use('/auth', userRoutes);
app.use(errorHandler);

module.exports = app;