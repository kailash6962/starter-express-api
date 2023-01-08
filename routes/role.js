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
} = require("../controllers/Role");

router.post('/roles-create', requireSignin, formidable(), create);
router.get('/roles-read', requireSignin, formidable() ,  readall);
router.get('/roles-readone', requireSignin, formidable() ,  readone);
router.post('/roles-update', requireSignin, formidable() ,  update);
router.get('/roles-remove', requireSignin, formidable() ,  remove);


module.exports = router;