const express = require("express");
const {validateNewUser, validateUser} = require("../validators/user_validators");
const {registerUser, loginUser, dashboard} = require("../controllers/user_controllers");
const requireAuth = require("../middlewares/requireAuth")
const router = express.Router();

router.post('/register', validateNewUser, registerUser);

router.post('/login', validateUser, loginUser);

router.get('/me/:id', requireAuth, dashboard)

module.exports = router;