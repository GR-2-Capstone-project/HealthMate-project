const Joi = require('joi');

// Validate scheduled times using 24-hour HH:mm format
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

// Validation rules for creating a medication schedule
const createScheduleSchema = Joi.object({
  frequency: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Medication frequency is required',
      'any.required': 'Medication frequency is required'
    }),

  scheduledTimes: Joi.array()
    .items(
      Joi.string().pattern(timePattern).messages({
        'string.pattern.base': 'Scheduled times must use HH:mm format'
      })
    )
    .min(1)
    .unique()
    .required(),

  startDate: Joi.date()
    .iso()
    .required(),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .allow(null)
    .optional()
    .messages({
      'date.min': 'End date cannot be before start date'
    }),

  remindersEnabled: Joi.boolean()
    .default(true),

  status: Joi.string()
    .valid('active', 'inactive')
    .default('active')
}).unknown(false);

// Validation rules for updating a medication schedule
const updateScheduleSchema = Joi.object({
  frequency: Joi.string().trim(),

  scheduledTimes: Joi.array()
    .items(Joi.string().pattern(timePattern))
    .min(1)
    .unique(),

  startDate: Joi.date().iso(),

  endDate: Joi.date().iso().allow(null),

  remindersEnabled: Joi.boolean(),

  status: Joi.string().valid('active', 'inactive')
}).min(1).unknown(false);

// Export the validation schemas
module.exports = {
  createScheduleSchema,
  updateScheduleSchema
};