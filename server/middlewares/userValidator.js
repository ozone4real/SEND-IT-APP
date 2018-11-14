import validationHelper from './helpers/validationHelpers';

function improperVal(req) {
  const {
    fullname, email, phoneNo, password,
  } = req.body;

  const fnameTest = /^[a-zA-Z]+? [a-zA-Z]+?( [a-zA-Z]+?)?$/.test(fullname);
  const emailTest = /[-.\w]+@([\w-]+\.)+[\w-]{2,20}/.test(email);
  const phNoTest = /^\d{10,20}$/.test(phoneNo);
  const passwordTest = /.{7,}/.test(password);

  const improperValues = [];

  if (!fnameTest) improperValues.push('Improper name pattern. There should be a space between first and last name. E.g: \'John Smith\'');
  if (!passwordTest) improperValues.push('Password too short. Should be at least 7 characters');
  if (!phNoTest) improperValues.push('Invalid phone No');
  if (!emailTest) improperValues.push('Invalid email');

  return improperValues;
}

function userValidator(req, res, next) {
  const dataKeys = ['fullname', 'email', 'phoneNo', 'password'];
  validationHelper(req, res, dataKeys, improperVal, next);
}

export default userValidator;
