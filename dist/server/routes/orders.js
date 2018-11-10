'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _parcelData = require('../db/parcelData');

var _parcelData2 = _interopRequireDefault(_parcelData);

var _validator = require('../middlewares/validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

router.use((0, _express.json)());
router.use((0, _express.urlencoded)({ extended: true }));

router.post('/', _validator2.default, function (req, res) {
  var order = req.body;
  order.id = _parcelData2.default.length + 1;
  order.status = 'received';
  _parcelData2.default.push(order);
  res.status(200).send(order);
});

router.get('/:parcelId', function (req, res) {
  var parcelId = req.params.parcelId;

  var order = _parcelData2.default.find(function (a) {
    return a.parcelId === parseInt(parcelId);
  });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.status(200).json(order);
});

router.get('/', function (req, res) {
  res.status(200).json(_parcelData2.default);
});

router.put('/:parcelId/cancel/', function (req, res) {
  var parcelId = req.params.parcelId;

  var parcelOrder = _parcelData2.default.find(function (a) {
    return a.parcelId === parseInt(parcelId);
  });
  if (!parcelOrder) return res.status(404).json({ message: 'Order not found' });
  parcelOrder.status = 'cancelled';
  res.status(200).send(parcelOrder);
});

exports.default = router;