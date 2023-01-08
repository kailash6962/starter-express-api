import express from "express";

const router = express.Router();
const formidable = require("express-formidable");


var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

//middleware
const { requireSignin } = require("../middlewares");

//controllers
import {readall,update} from "../controllers/Setting";


router.post('/systemsettings-update', upload.single('image'),update);//requireSignin, formidable(), upload.single('image'),
//router.post('/systemsettings-create', requireSignin, formidable(), create);
router.get('/systemsettings-read', requireSignin, formidable(), readall);


module.exports = router;