const mongoose = require('mongoose');

// Define the Medication Log schema
const medicationLogSchema = new mongoose.Schema(
  {
    // Reference to the medication schedule
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicationSchedule',
      required: [true, 'A medication schedule reference is required'],
      index: true
    },

    // Reference to the user who recorded the activity
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },

    // Outcome of the medication activity
    activityStatus: {
      type: String,
      enum: ['taken', 'missed'],
      required: [true, 'Activity status is required']
    },

    // Date and time the user recorded the activity
    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Medication Log model
const MedicationLog = mongoose.model(
  'MedicationLog',
  medicationLogSchema
);

module.exports = MedicationLog;