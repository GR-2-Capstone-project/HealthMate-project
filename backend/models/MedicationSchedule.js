const mongoose = require('mongoose');

// Define the Medication Schedule schema
const medicationScheduleSchema = new mongoose.Schema(
  {
    // Reference to the medication being scheduled
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      required: [true, 'A medication reference is required'],
      index: true
    },

    // Frequency supplied by the user
    frequency: {
      type: String,
      required: [true, 'Medication frequency is required'],
      trim: true
    },

    // One or more scheduled times in 24-hour HH:mm format
    scheduledTimes: {
      type: [String],
      required: [true, 'At least one scheduled time is required'],
      validate: {
        validator: function (times) {
          const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

          return (
            Array.isArray(times) &&
            times.length > 0 &&
            times.every(time => timePattern.test(time))
          );
        },
        message: 'Provide at least one valid scheduled time in HH:mm format'
      }
    },

    // Date the medication schedule begins
    startDate: {
      type: Date,
      required: [true, 'Schedule start date is required']
    },

    // Optional date the medication schedule ends
    endDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (endDate) {
          return !endDate || !this.startDate || endDate >= this.startDate;
        },
        message: 'End date cannot be before start date'
      }
    },

    // Controls whether reminders are enabled for this schedule
    remindersEnabled: {
      type: Boolean,
      default: true
    },

    // Current status of the medication schedule
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },

    // Records when a schedule was deleted
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Medication Schedule model
const MedicationSchedule = mongoose.model(
  'MedicationSchedule',
  medicationScheduleSchema
);

module.exports = MedicationSchedule;