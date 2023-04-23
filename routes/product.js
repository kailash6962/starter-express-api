const express = require("express");

const router = express.Router();
const formidable = require("express-formidable");

//middleware
const { requireSignin } = require("../middlewares");

//controllers
const {
    readall,
    create,
    remove,
    readone,
    update,
    createcode,
} = require("../controllers/Product");

router.post('/products-create', requireSignin, formidable(), create);
router.post('/products-read', requireSignin, formidable(), readall);
router.get('/products-readone', requireSignin, formidable() ,  readone);
router.get('/products-createcode', requireSignin, formidable(), createcode);
router.get('/products-remove', requireSignin, formidable() ,  remove);
router.post('/products-update', requireSignin, formidable() ,  update);



module.exports = router;