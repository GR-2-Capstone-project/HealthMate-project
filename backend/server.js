
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import our MongoDB connection function
const connectDB = require('./config/db');

const app = express();

// Security and application middleware
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5500'
}));

app.use(express.json({ limit: '10kb' }));

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HealthMate API is running',
    timestamp: new Date().toISOString()
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`HealthMate API is listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to start HealthMate API:', error.message);
    process.exit(1);
  }
};

startServer();
