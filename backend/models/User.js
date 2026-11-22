const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    // User's full name
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    // User's email address
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address'
      ]
    },

    // User's password (stored as a bcrypt hash)
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must contain at least 8 characters'],
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
