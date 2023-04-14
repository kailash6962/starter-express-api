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
} from "../controllers/Auth";

router.post('/register',formidable(), register);
router.post('/login', formidable(),login);
router.post('/send-verificationmail', formidable(),sendverifyemail);
router.post('/send-otpmail', formidable(),sendotpmail);
router.post('/updatepassword', formidable(),updatepassword);

router.get('/verifyemail', verifyemail);
router.get('/getuseraccesslinks', requireSignin, formidable(), getuseraccesslinks);

module.exports = router;