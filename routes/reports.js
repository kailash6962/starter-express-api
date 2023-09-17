import express from "express";

const router = express.Router();
const formidable = require("express-formidable");

//middleware
const { requireSignin } = require("../middlewares");

//controllers
import {
    generateReport
} from "../controllers/Reports";

router.post('/generate-report', requireSignin, formidable(), generateReport);


module.exports = router;