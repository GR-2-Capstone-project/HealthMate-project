const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    // User's email address
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // User's password (stored as a bcrypt hash)
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    timezone: {
      type: String,
      default: 'Africa/Lagos'
    }
  },
  {
    timestamps: true
  }
);

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;