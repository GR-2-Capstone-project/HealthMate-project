// Load environment variables
require('dotenv').config();

// Import the Express application
const app = require('./src/app');

// Import MongoDB connection function
const connectDB = require('./src/config/db');

// Server port
const PORT = process.env.PORT || 5000;

// Start the application after connecting to MongoDB
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