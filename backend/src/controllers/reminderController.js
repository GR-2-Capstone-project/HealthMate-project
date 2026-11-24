const mongoose = require('mongoose');

const Medication = require('../models/Medication');
const MedicationSchedule = require('../models/MedicationSchedule');
const Reminder = require('../models/Reminder');


// GET ALL UPCOMING REMINDERS FOR THE AUTHENTICATED USER
const getUpcomingReminders = async (req, res) => {
  try {
    // Identify the authenticated user
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Find medications belonging to this user
    const medicationIds = await Medication.distinct('_id', {
      userId
    });

    // Find active schedules with reminders enabled
    const schedules = await MedicationSchedule.find({
      medicationId: { $in: medicationIds },
      status: 'active',
      remindersEnabled: true,
      deletedAt: null
    }).select('_id');

    const scheduleIds = schedules.map(schedule => schedule._id);

    // Retrieve upcoming pending reminders
    const reminders = await Reminder.find({
      scheduleId: { $in: scheduleIds },
      reminderTime: { $gte: new Date() },
      notificationStatus: 'pending'
    })
      .sort({ reminderTime: 1 })
      .populate({
        path: 'scheduleId',
        select: 'medicationId frequency scheduledTimes startDate endDate',
        populate: {
          path: 'medicationId',
          select: 'medicationName dosageDetails'
        }
      });

    return res.status(200).json({
      status: 'success',
      results: reminders.length,
      data: { reminders }
    });

  } catch (error) {
    console.error('Get upcoming reminders error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve upcoming reminders'
    });
  }
};


// GET REMINDERS FOR A PARTICULAR MEDICATION SCHEDULE
const getScheduleReminders = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { scheduleId } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Validate schedule ID
    if (!mongoose.isValidObjectId(scheduleId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid medication schedule ID'
      });
    }

    // Find a schedule that has not been deleted
    const schedule = await MedicationSchedule.findOne({
      _id: scheduleId,
      deletedAt: null
    });

    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Medication schedule not found'
      });
    }

    // Verify ownership through the associated medication
    const medication = await Medication.findOne({
      _id: schedule.medicationId,
      userId
    });

    if (!medication) {
      return res.status(404).json({
        status: 'error',
        message: 'Medication schedule not found'
      });
    }

    // Retrieve reminder records for this schedule
    const reminders = await Reminder.find({
      scheduleId: schedule._id
    }).sort({ reminderTime: 1 });

    return res.status(200).json({
      status: 'success',
      results: reminders.length,
      data: { reminders }
    });

  } catch (error) {
    console.error('Get schedule reminders error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve schedule reminders'
    });
  }
};


// EXPORT CONTROLLER FUNCTIONS
module.exports = {
  getUpcomingReminders,
  getScheduleReminders
};