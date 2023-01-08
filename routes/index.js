const express = require("express");

const router = express.Router();

router.get('/', async (req,res) => {
    const response = {
        'Status':'Running',
        'Name':process.env.APP_NAME,
        'Application':'API',
        'API Version':process.env.VERSION,
        'Author':'ArumugaKailash K',
        'Since':'2022',
    }
    return res.status(200).json(response);
});


module.exports = router;