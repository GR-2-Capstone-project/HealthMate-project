const Joi = require('joi');

// Validation rules for creating a medication
const createMedicationSchema = Joi.object({
  medicationName: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Medication name is required',
      'any.required': 'Medication name is required'
    }),

  dosageDetails: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Dosage information is required',
      'any.required': 'Dosage information is required'
    })
}).unknown(false);

// Validation rules for updating a medication
const updateMedicationSchema = Joi.object({
  medicationName: Joi.string()
    .trim(),

  dosageDetails: Joi.string()
    .trim()
}).min(1).unknown(false);

// Export the validation schemas
module.exports = {
  createMedicationSchema,
  updateMedicationSchema
};