import { read } from 'fs';

/* eslint-disable consistent-return */
const dataKeys = ['userId', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription'];

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

function incompleteVal(req) {
  const missingKeys = [];

  dataKeys.forEach((item) => {
    if (!req.body[item]) missingKeys.push(item);
  });

  return missingKeys;
}

function unwantedKeys(req) {
  const unwanted = [];
  const reqBody = Object.keys(req.body);
  reqBody.forEach((item) => {
    if (!dataKeys.includes(item)) unwanted.push(item);
  });

  return unwanted;
}

function validator(req, res, next) {
  let unwanted = unwantedKeys(req);

  if (unwanted.length !== 0) {
    unwanted = unwanted.join(', ');
    return res.status(400).json({ message: `Unwanted parameter(s) ${unwanted}` });
  }

  let missingKeys = incompleteVal(req);

  if (missingKeys.length !== 0) {
    missingKeys = missingKeys.join(', ');
    return res.status(400).json({ message: `Incomplete request: ${missingKeys} parameter(s) missing` });
  }

  let improperValues = improperVal(req);

  if (improperValues.length !== 0) {
    improperValues = improperValues.join(', ');
    return res.status(400).json({ message: improperValues });
  }
  next();
}

export default validator;
