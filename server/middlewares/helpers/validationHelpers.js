import { runInNewContext } from 'vm';

function missingKeys(req, keys) {
  const missing = [];

  keys.forEach((item) => {
    if (!req.body[item]) missing.push(item);
  });

  return missing;
}

function unwantedKeys(req, keys) {
  const unwanted = [];
  const reqBody = Object.keys(req.body);
  reqBody.forEach((item) => {
    if (!keys.includes(item)) unwanted.push(item);
  });

  return unwanted;
}

function validator(req, res, keys, improperVal, next) {
  let unwanted = unwantedKeys(req, keys);
  let missing = missingKeys(req, keys);
  let improperValues = improperVal(req);

  if (unwanted.length !== 0) {
    unwanted = unwanted.join(', ');
    return res.status(400).json({ message: `Unwanted parameter(s) ${unwanted}` });
  }

  if (missing.length !== 0) {
    missing = missing.join(', ');
    const respMessage = `Incomplete request: ${missing} parameter(s) missing`;
    return res.status(400).json({ message: respMessage });
  }

  if (improperValues.length !== 0) {
    improperValues = improperValues.join(', ');
    return res.status(400).json({ message: improperValues });
  }
  next();
}


export default validator;
