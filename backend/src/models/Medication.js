const mongoose = require('mongoose');

// Define the Medication schema
const medicationSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this medication
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Medication must belong to a user'],
      index: true
    },

    // Name of the medication
    medicationName: {
      type: String,
      required: [true, 'Medication name is required'],
      trim: true
    },

    // Dosage information supplied by the user
    dosageDetails: {
      type: String,
      required: [true, 'Dosage information is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Medication model
const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;