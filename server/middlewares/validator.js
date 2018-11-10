/* eslint-disable consistent-return */
function validator(req, res, next) {
  const {
    userId, pickupAddress, deliveryAddress, deliveryTime, parcelDescription,
  } = req.body;

  if (!userId || !pickupAddress || !deliveryAddress || !deliveryTime || !parcelDescription) {
    return res.status(400).json({ message: 'Incomplete request' });
  }

  const timeTest = /^\d{4}-((1[0-2])|(0[1-9]))-((3[0-1])|([0-2][1-9]))T(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/.test(deliveryTime);
  const pAdTest = /\d.{10,}/.test(pickupAddress);
  const dAdTest = /\d.{10,}/.test(deliveryAddress);
  const pDeTest = /.{5,25}/.test(parcelDescription);

  if (!timeTest || !pAdTest || !dAdTest || !pDeTest) {
    return res.status(400).json({ message: 'Improper data provided' });
  }

  next();
}

export default validator;
