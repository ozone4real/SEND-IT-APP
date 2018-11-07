const express = require('express');
const deliveryData = require('./db/deliveryData');
const validateOrder = require('./middlewares/validator');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


module.exports = router;
