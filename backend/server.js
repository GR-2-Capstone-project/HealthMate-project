require('dotenv').config();
const app = require("./src/app");

// Import our MongoDB connection function
const connectDB = require('./src/config/db');


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
connectDB()
app.listen(PORT, () => {
      console.log(`HealthMate API is listening on port ${PORT}`);
    });