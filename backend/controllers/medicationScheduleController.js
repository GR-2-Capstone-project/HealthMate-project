const mongoose = require('mongoose');

const Reminder = require('../models/Reminder');

const Medication = require('../models/Medication');
const MedicationSchedule = require('../models/MedicationSchedule');

const {
  createScheduleSchema,
  updateScheduleSchema
} = require('../validators/scheduleValidator');


// CREATE MEDICATION SCHEDULE
const createMedicationSchedule = async (req, res) => {
  try {
    // Identify the authenticated user
    const userId = req.user?._id;

    const { medicationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Validate medication ID
    if (!mongoose.isValidObjectId(medicationId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid medication ID'
      });
    }

    // Validate schedule information
    const { error, value } = createScheduleSchema.validate(
      req.body,
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Schedule validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Confirm that the medication belongs to the authenticated user
    const medication = await Medication.findOne({
      _id: medicationId,
      userId
    });

    if (!medication) {
      return res.status(404).json({
        status: 'error',
        message: 'Medication not found'
      });
    }

    // Create the medication schedule
    const schedule = await MedicationSchedule.create({
      ...value,
      medicationId: medication._id
    });

    return res.status(201).json({
      status: 'success',
      message: 'Medication schedule created successfully',
      data: { schedule }
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Schedule validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    console.error('Create medication schedule error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to create medication schedule'
    });
  }
};

// GET ALL SCHEDULES FOR A MEDICATION
const getMedicationSchedules = async (req, res) => {
  try {
    // Identify the authenticated user
    const userId = req.user?._id;

    const { medicationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Validate medication ID
    if (!mongoose.isValidObjectId(medicationId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid medication ID'
      });
    }

    // Confirm that the medication belongs to the user
    const medication = await Medication.findOne({
      _id: medicationId,
      userId
    });

    if (!medication) {
      return res.status(404).json({
        status: 'error',
        message: 'Medication not found'
      });
    }

    // Retrieve schedules that have not been deleted
    const schedules = await MedicationSchedule.find({
      medicationId: medication._id,
      deletedAt: null
    }).sort({ startDate: 1, createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: { schedules }
    });

  } catch (error) {
    console.error('Get medication schedules error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve medication schedules'
    });
  }
};

// UPDATE MEDICATION SCHEDULE
const updateMedicationSchedule = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { scheduleId } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!mongoose.isValidObjectId(scheduleId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid schedule ID'
      });
    }

    // Validate submitted changes
    const { error, value } = updateScheduleSchema.validate(
      req.body,
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Schedule validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Find an existing, non-deleted schedule
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

    // Validate the combined start and end dates
    const nextStartDate = value.startDate ?? schedule.startDate;

    const nextEndDate = Object.prototype.hasOwnProperty.call(value, 'endDate')
      ? value.endDate
      : schedule.endDate;

    if (nextEndDate && nextEndDate < nextStartDate) {
      return res.status(400).json({
        status: 'error',
        message: 'End date cannot be before start date'
      });
    }

    // Check whether existing reminders may need replacement
    const timingChanged = [
      'frequency',
      'scheduledTimes',
      'startDate',
      'endDate'
    ].some(field => Object.prototype.hasOwnProperty.call(value, field));

    // Apply the validated changes
    Object.assign(schedule, value);

    await schedule.save();

    // Cancel pending reminders when necessary
    if (
      timingChanged ||
      schedule.status === 'inactive' ||
      schedule.remindersEnabled === false
    ) {
      await Reminder.updateMany(
        {
          scheduleId: schedule._id,
          notificationStatus: 'pending'
        },
        {
          $set: { notificationStatus: 'cancelled' }
        }
      );
    }

    return res.status(200).json({
      status: 'success',
      message: 'Medication schedule updated successfully',
      data: { schedule }
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Schedule validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    console.error('Update medication schedule error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to update medication schedule'
    });
  }
};

// SOFT DELETE MEDICATION SCHEDULE
const deleteMedicationSchedule = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { scheduleId } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!mongoose.isValidObjectId(scheduleId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid schedule ID'
      });
    }

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

    // Confirm ownership through the associated medication
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

    // Mark the schedule as deleted without removing its history
    schedule.status = 'inactive';
    schedule.remindersEnabled = false;
    schedule.deletedAt = new Date();

    await schedule.save();

    // Cancel reminders that have not yet been sent
    await Reminder.updateMany(
      {
        scheduleId: schedule._id,
        notificationStatus: 'pending'
      },
      {
        $set: { notificationStatus: 'cancelled' }
      }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Medication schedule deleted successfully'
    });

  } catch (error) {
    console.error('Delete medication schedule error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to delete medication schedule'
    });
  }
};

// EXPORT CONTROLLER FUNCTIONS
module.exports = {
  createMedicationSchedule,
  getMedicationSchedules,
  updateMedicationSchedule,
  deleteMedicationSchedule
};