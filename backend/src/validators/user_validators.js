const {
    createUserSchema,
    userLoginSchema,
    updateTimezoneSchema
} = require("../schemas/user_schemas");

const validateNewUser = (req, res, next) => {
    const {error, value} = createUserSchema.validate(req.body);
    if (error){
        return res.status(400).json({error: error.details[0].message});
    }
    req.body = value;
    next();
};

const validateUser = (req, res, next) => {
    const {error, value} = userLoginSchema.validate(req.body);
    if (error){
        return res.status(400).json({error: error.details[0].message})
    }
    req.body = value;
    next();
};

module.exports = {validateNewUser, validateUser}