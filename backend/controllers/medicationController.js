const mongoose = require('mongoose');

const Medication = require('../models/Medication');

const {
  createMedicationSchema,
  updateMedicationSchema
} = require('../validators/medicationValidator');


// CREATE MEDICATION
const createMedication = async (req, res) => {
  try {
    // Identify the authenticated user
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Validate submitted information
    const { error, value } = createMedicationSchema.validate(
      req.body,
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Medication validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Save medication with the authenticated user's ID
    const medication = await Medication.create({
      ...value,
      userId
    });

    return res.status(201).json({
      status: 'success',
      message: 'Medication created successfully',
      data: { medication }
    });

  } catch (error) {
    console.error('Create medication error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to create medication'
    });
  }
};


// GET ALL MEDICATIONS BELONGING TO THE USER
const getMedications = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const medications = await Medication.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      results: medications.length,
      data: { medications }
    });

  } catch (error) {
    console.error('Get medications error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve medications'
    });
  }
};


// GET ONE MEDICATION
const getMedicationById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { medicationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!mongoose.isValidObjectId(medicationId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid medication ID'
      });
    }

    // Find medication belonging to this user
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

    return res.status(200).json({
      status: 'success',
      data: { medication }
    });

  } catch (error) {
    console.error('Get medication error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve medication'
    });
  }
};


// UPDATE MEDICATION
const updateMedication = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { medicationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!mongoose.isValidObjectId(medicationId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid medication ID'
      });
    }

    // Validate submitted changes
    const { error, value } = updateMedicationSchema.validate(
      req.body,
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Medication update validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Update only a medication belonging to this user
    const medication = await Medication.findOneAndUpdate(
      { _id: medicationId, userId },
      { $set: value },
      {
        returnDocument: 'after',
        runValidators: true
     }
    );

    if (!medication) {
      return res.status(404).json({
        status: 'error',
        message: 'Medication not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Medication updated successfully',
      data: { medication }
    });

  } catch (error) {
    console.error('Update medication error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to update medication'
    });
  }
};


// EXPORT CONTROLLER FUNCTIONS
module.exports = {
  createMedication,
  getMedications,
  getMedicationById,
  updateMedication
};