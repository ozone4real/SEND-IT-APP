/* eslint-disable consistent-return */
import validationHelper from './helpers/validationHelpers';

function improperVal(req) {
  const {
    pickupAddress, deliveryAddress, deliveryTime, parcelDescription,
  } = req.body;

  const timeTest = /^\d{4}-((1[0-2])|(0[1-9]))-((3[0-1])|([0-2][1-9]))T(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/.test(deliveryTime);
  const pAdTest = /.{15,}/.test(pickupAddress);
  const dAdTest = /.{15,}/.test(deliveryAddress);
  const pDeTest = /.{10,40}/.test(parcelDescription);

  const improperValues = [];

  if (!timeTest) improperValues.push('Improper date-time format or invalid date. Pattern should follow: YYYY:MM:DDThh:mm');
  if (!pAdTest) improperValues.push('pickupAddress not detailed enough');
  if (!dAdTest) improperValues.push('deliveryAddress not detailed enough');
  if (!pDeTest) improperValues.push('parcelDescription not detailed enough or too long. Min. Length:15, Max. Length:40');

  return improperValues;
}


function parcelValidator(req, res, next) {
  const dataKeys = ['userId', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription'];
  validationHelper(req, res, dataKeys, improperVal, next);
}

export default parcelValidator;
