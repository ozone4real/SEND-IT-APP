'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable consistent-return */
function validator(req, res, next) {
  var _req$body = req.body,
      userId = _req$body.userId,
      pickupAddress = _req$body.pickupAddress,
      deliveryAddress = _req$body.deliveryAddress,
      deliveryTime = _req$body.deliveryTime,
      parcelDescription = _req$body.parcelDescription;


  if (!userId || !pickupAddress || !deliveryAddress || !deliveryTime || !parcelDescription) {
    return res.status(400).json({ message: 'Incomplete request' });
  }

  var timeTest = /^\d{4}-((1[0-2])|(0[1-9]))-((3[0-1])|([0-2][1-9]))T(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/.test(deliveryTime);
  var pAdTest = /\d.{10,}/.test(pickupAddress);
  var dAdTest = /\d.{10,}/.test(deliveryAddress);
  var pDeTest = /.{5,25}/.test(parcelDescription);

  if (!timeTest || !pAdTest || !dAdTest || !pDeTest) {
    return res.status(400).json({ message: 'Improper data provided' });
  }

  next();
}

exports.default = validator;