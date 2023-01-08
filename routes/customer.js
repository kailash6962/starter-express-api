const express = require("express");

const router = express.Router();

//middleware
const formidable = require("express-formidable");
const { requireSignin } = require("../middlewares");

//controllers
const {
    readall,
    readone,
    create,
    remove,
    update,
    createcode
} = require("../controllers/customer");

router.post('/customers-create', requireSignin, formidable(), create);
router.get('/customers-createcode', requireSignin, formidable(), createcode);
router.get('/customers-read', requireSignin, formidable() ,  readall);
router.get('/customers-readone', requireSignin, formidable() ,  readone);
router.post('/customers-update', requireSignin, formidable() ,  update);
router.get('/customers-remove', requireSignin, formidable() ,  remove);


module.exports = router;