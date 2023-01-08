const express = require("express");

const router = express.Router();
const formidable = require("express-formidable");

//middleware
const { requireSignin } = require("../middlewares");

//controllers
const {
    readall,
    readone,
    create,
    remove,
    update,
    createcode
} = require("../controllers/Staff");

router.post('/staffs-create', requireSignin, formidable(), create);
router.get('/staffs-createcode', requireSignin, formidable(), createcode);
router.get('/staffs-read', requireSignin, formidable() ,  readall);
router.get('/staffs-readone', requireSignin, formidable() ,  readone);
router.post('/staffs-update', requireSignin, formidable() ,  update);
router.get('/staffs-remove', requireSignin, formidable() ,  remove);


module.exports = router;