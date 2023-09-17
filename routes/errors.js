import express from "express";

const router = express.Router();
const formidable = require("express-formidable");


var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

//middleware
const { requireSignin } = require("../middlewares");

//controllers
import {
    report
} from "../controllers/Errors";

router.post('/report-problem', requireSignin, formidable(), report);


module.exports = router;