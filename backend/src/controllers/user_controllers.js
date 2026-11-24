const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User")
const passwordHash = require("../utils/password_hash");

const registerUser = async(req, res, next) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return res.status(400).json({message: "User already exist"});
        };

        const hashed = await passwordHash(password);

        const user = new User({
            name: name,
            email: email,
            password: hashed
        }) ;

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
            password: user.password
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
            return res.status(404).json({message: "User does not exist"});
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) throw new Error('Invalid credentials');

        const token = jwt.sign(
            {userId: user._id, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        const resUser = {
            _id: user.id,
            email: user.email,
            name: user.name
        }

        return res.status(200).json({message: "User logged in", user: resUser, token})
    } catch (error) {
        next(error);
    }
};


const dashboard = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const user = await User.findOne({_id: _id});
        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {registerUser, loginUser, dashboard};