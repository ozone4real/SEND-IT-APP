/* eslint-disable consistent-return */
function improperVal(req, res) {
  const {
    pickupAddress, deliveryAddress, deliveryTime, parcelDescription,
  } = req.body;

  const timeTest = /^\d{4}-((1[0-2])|(0[1-9]))-((3[0-1])|([0-2][1-9]))T(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/.test(deliveryTime);
  const pAdTest = /.{15,}/.test(pickupAddress);
  const dAdTest = /.{15,}/.test(deliveryAddress);
  const pDeTest = /.{10,40}/.test(parcelDescription);

  let improperValues = [];

  if (!timeTest) improperValues.push('Improper date-time format or invalid date. Pattern should follow: yyyy:mm:ddThh:mm');
  if (!pAdTest) improperValues.push('pickupAddress not detailed enough');
  if (!dAdTest) improperValues.push('deliveryAddress not detailed enough');
  if (!pDeTest) improperValues.push('parcelDescription not detailed enough or too long. Min. Length:15, Max. Length:40');

  if (improperValues.length !== 0) {
    improperValues = improperValues.join(', ');
    return res.status(400).json({ message: improperValues });
  }
}


function validator(req, res, next) {
  const dataKeys = ['userId', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription'];

  let missingKeys = [];

  dataKeys.forEach((item) => {
    if (!req.body[item]) missingKeys.push(item);
  });

  if (missingKeys.length !== 0) {
    missingKeys = missingKeys.join(', ');
    return res.status(400).json({ message: `Incomplete request: ${missingKeys} parameters are missing` });
  }

  improperVal(req, res);
  next();
}


export default validator;
