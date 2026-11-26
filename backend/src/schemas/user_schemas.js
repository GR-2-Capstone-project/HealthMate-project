const Joi = require("joi");
const isValidTimeZone = require("../utils/timezone");

// Validation rules for user registration
const createUserSchema = Joi.object({
    name: Joi.string().min(2).required(),

    email: Joi.string().lowercase().email().required(),

    password: Joi.string().min(8).required(),

    // Timezone is optional; the User model supplies the default
    timeZone: Joi.string()
        .trim()
        .custom((value, helpers) => {
            if (!isValidTimeZone(value)) {
                return helpers.error("any.invalid");
            }

            return value;
        })
        .optional()
        .messages({
            "any.invalid": "Please provide a valid IANA timezone identifier"
        })
});

// Validation rules for user login
const userLoginSchema = Joi.object({
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().min(8).required()
});

//const updateTimezoneSchema = Joi.object({
  //timezone: timezoneField.allow('auto').required(),
//});

module.exports = {
    createUserSchema,
    userLoginSchema
};
