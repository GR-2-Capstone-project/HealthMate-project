const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User")
const passwordHash = require("../utils/password_hash");

const registerUser = async(req, res, next) => {
    try {
        const {name, email, password, timeZone} = req.body;

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return res.status(400).json({message: "User already exist"});
        };

        const hashed = await passwordHash(password);

        const user = new User({
          name: name,
          email: email,
          password: hashed,
          timeZone: timeZone
        });

        await user.save();

        const token = jwt.sign(
            {userId: user._id, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        const resUser = {
           _id: user.id,
           email: user.email,
           name: user.name,
           timeZone: user.timeZone
        };

        return res.status(201).json({
            message: "User registered successfully",
            user: resUser,
            token
        });
    } catch (error) {
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email}).select('+password');
        if(!user){
            console.error(`Login failed: no user found with email ${email}`);
            return res.status(401).json({message: "Invalid credentials"});
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            console.error(`Login failed: wrong password for email ${email}`);
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign(
            {userId: user._id, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        const resUser = {
            _id: user.id,
            email: user.email,
            name: user.name,
            timeZone: user.timeZone
        }

        return res.status(200).json({message: "User logged in", user: resUser, token})
    } catch (error) {
        next(error);
    }
};


const dashboard = async (req, res, next) => {
    try {
        // requireAuth has already loaded the user into req.user
        const user = req.user;

        // The id in the URL must be the caller's own id.
        // Anything else (another user's id, or a malformed one) gets the same 404.
        if (req.params.id !== user.id) {
            return res.status(404).json({message: "user not found"});
        }

        return res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            timeZone: user.timeZone
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {registerUser, loginUser, dashboard};