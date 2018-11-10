'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _parcelData = require('../db/parcelData');

var _parcelData2 = _interopRequireDefault(_parcelData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

router.use((0, _express.json)());
router.use((0, _express.urlencoded)({ extended: true }));

router.get('/:userId/parcels', function (req, res) {
  var userId = req.params.userId;

  var userOrders = _parcelData2.default.filter(function (a) {
    return a.userId === userId;
  });
  if (userOrders.length === 0) return res.status(404).json({ message: 'No orders found for user' });
  res.status(200).json(userOrders);
});

exports.default = router;