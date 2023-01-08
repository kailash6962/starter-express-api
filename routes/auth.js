import express from "express";

const router = express.Router();

//middleware
const formidable = require("express-formidable");
const { requireSignin } = require("../middlewares");

//controllers 
import {
    login,
    register,
    verifyemail,
    sendverifyemail,
    sendotpmail,
    updatepassword,
    getuseraccesslinks,
} from "../controllers/auth";

router.post('/register', register);
router.post('/login', login);
router.post('/send-verificationmail', sendverifyemail);
router.post('/send-otpmail', sendotpmail);
router.post('/updatepassword', updatepassword);

router.get('/verifyemail', verifyemail);
router.get('/getuseraccesslinks', requireSignin, formidable(), getuseraccesslinks);

module.exports = router;