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
    createcode
} = require("../controllers/InvoicePay");

router.post('/invpay-create', requireSignin, formidable(), create);
router.get('/invpay-createcode', requireSignin, formidable(), createcode);
router.post('/invpay-read', requireSignin, formidable(),  readall);
router.post('/invpay-readone', requireSignin, formidable() ,  readone);
// router.post('/invpay-update', requireSignin, formidable() ,  update);
router.post('/invpay-remove', requireSignin, formidable() ,  remove);


module.exports = router;