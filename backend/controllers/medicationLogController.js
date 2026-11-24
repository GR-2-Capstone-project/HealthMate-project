const mongoose = require('mongoose');

const Medication = require('../models/Medication');
const MedicationSchedule = require('../models/MedicationSchedule');
const MedicationLog = require('../models/MedicationLog');

const {
  createMedicationLogSchema
} = require('../validators/medicationLogValidator');


// RECORD MEDICATION ACTIVITY
const createMedicationLog = async (req, res) => {
  try {
    // Identify the authenticated user
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

    // Validate activity information
    const { error, value } = createMedicationLogSchema.validate(
      req.body,
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Medication activity validation failed',
        errors: error.details.map(detail => detail.message)
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

    // Verify that the schedule belongs to the authenticated user
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

    // Record the user's medication activity
    const medicationLog = await MedicationLog.create({
      ...value,
      scheduleId: schedule._id,
      userId
    });

    return res.status(201).json({
      status: 'success',
      message: 'Medication activity recorded successfully',
      data: { medicationLog }
    });

    } catch (error) {
       if (error.name === 'ValidationError') {
        return res.status(400).json({
        status: 'error',
        message: 'Medication activity validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
     }

      console.error('Create medication log error:', error.message);

     return res.status(500).json({
      status: 'error',
      message: 'Unable to record medication activity'
    });
}
};


// GET USER'S MEDICATION ACTIVITY HISTORY
const getMedicationLogs = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Retrieve only this user's medication activity records
    const medicationLogs = await MedicationLog.find({ userId })
      .sort({ recordedAt: -1 })
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
      results: medicationLogs.length,
      data: { medicationLogs }
    });

  } catch (error) {
    console.error('Get medication logs error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve medication history'
    });
  }
};


// EXPORT CONTROLLER FUNCTIONS
module.exports = {
  createMedicationLog,
  getMedicationLogs
};