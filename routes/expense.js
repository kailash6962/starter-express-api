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
} = require("../controllers/Expense");

router.post('/expense-create', requireSignin, formidable(), create);
router.get('/expense-createcode', requireSignin, formidable(), createcode);
router.post('/expense-read', requireSignin, formidable(),  readall);
router.post('/expense-readone', requireSignin, formidable() ,  readone);
// router.post('/expense-update', requireSignin, formidable() ,  update);
router.post('/expense-remove', requireSignin, formidable() ,  remove);


module.exports = router;