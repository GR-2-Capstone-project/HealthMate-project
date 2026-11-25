const Joi = require("joi");
const { normalizeTimezone } = require('../utils/timezone');

const timezoneField = Joi.string()
  .trim()
  .custom((value, helpers) => {
    const normalized = normalizeTimezone(value);
    if (!normalized) return helpers.error('timezone.invalid');
    return normalized;
  })
  .messages({
    'timezone.invalid':
      '{{#label}} must be a valid IANA timezone, for example "Africa/Lagos"',
  });

const createUserSchema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).required(),
    timezone: timezoneField.optional().allow('', null),
});

const userLoginSchema = Joi.object({
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().min(8).required()
});

const updateTimezoneSchema = Joi.object({
  timezone: timezoneField.allow('auto').required(),
});

module.exports = {
    createUserSchema,
    userLoginSchema,
    updateTimezoneSchema
}