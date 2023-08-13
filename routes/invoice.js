const express = require("express");

const router = express.Router();

//middleware
const formidable = require("express-formidable");
const { requireSignin } = require("../middlewares");



//controllers
const {
    read,
    readone,
    create,
    remove,
    update,
    createcode
} = require("../controllers/Invoice");

router.post('/invoice-create', requireSignin, formidable(), create);
router.get('/invoice-createcode', requireSignin, formidable(), createcode);
router.post('/invoice-read', requireSignin, formidable(),  read);
router.post('/invoice-readone', requireSignin, formidable() ,  readone);
router.post('/invoice-update', requireSignin, formidable() ,  update);
// router.get('/customers-remove', requireSignin, formidable() ,  remove);


module.exports = router;