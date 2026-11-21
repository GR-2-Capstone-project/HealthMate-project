
// 1. Load environment variables
require('dotenv').config();

// 2. Import required packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// 3. Create the Express application
const app = express();

// 4. Configure application middleware
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5500'
}));

app.use(express.json({ limit: '10kb' }));

// 5. Create a health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HealthMate API is running',
    timestamp: new Date().toISOString()
  });
});

// 6. Configure the server port
const PORT = process.env.PORT || 5000;

// 7. Start the server
app.listen(PORT, () => {
  console.log(`HealthMate API is listening on port ${PORT}`);
});
