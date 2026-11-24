const mongoose = require('mongoose');

// Define the Reminder schema
const reminderSchema = new mongoose.Schema(
  {
    // Reference to the medication schedule
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicationSchedule',
      required: [true, 'A medication schedule reference is required'],
      index: true
    },

    // Date and time the reminder is due
    reminderTime: {
      type: Date,
      required: [true, 'Reminder time is required'],
      index: true
    },

    // Status of the notification
    notificationStatus: {
     type: String,
     enum: ['pending', 'sent', 'failed', 'cancelled'],
     default: 'pending',
     required: true
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Reminder model
const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;