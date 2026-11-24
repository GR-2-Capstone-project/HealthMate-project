const Joi = require('joi');

// Validation rules for recording a medication activity
const createMedicationLogSchema = Joi.object({
  activityStatus: Joi.string()
    .valid('taken', 'missed')
    .required()
    .messages({
      'any.only': 'Activity status must be either taken or missed',
      'any.required': 'Activity status is required',
      'string.empty': 'Activity status is required'
    })
}).unknown(false);

// Export the validation schema
module.exports = {
  createMedicationLogSchema
};