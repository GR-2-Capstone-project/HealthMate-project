
const mongoose = require('mongoose');

// Function responsible for connecting to MongoDB Atlas
const connectDB = async () => {
  try {
    // Check that the connection string exists
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is missing from the environment variables');
    }

    // Establish the MongoDB connection
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log(`MongoDB connected to database: ${mongoose.connection.name}`);

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

// Make the function available to other files
module.exports = connectDB;
